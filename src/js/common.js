$(function() {
    // Input fields
    var $form = $('.payment__form');
    var $card_pan = $form.find('input[name=pan]');
    var $card_exp_month = $form.find('input[name=exp_date_m]');
    var $card_exp_year = $form.find('input[name=exp_date_y]');
    var $card_cvc = $form.find('input[name=cvv]');
    var $card_holder = $form.find('input[name=cardholder]');
    var $form_submit_btn = $form.find('.btn_submit');
    var $card_icon = $form.find('.paysys i');
    var $toast = $('.toast');

    var inputs = [
        $card_pan,
        $card_exp_month,
        $card_exp_year,
        $card_cvc,
        $card_holder
    ];

    var supported_card_brands = ['visa', 'mastercard', 'maestro'];

    // Redirect to 3DS timeout (seconds)
    var form_submit_timout = 6;

    // Disabled form in N seconds
    var form_disabled_timeout = 900;

    // Set error messages from language file
    $.mergeErrorMessages(lang.error_messages || {});

    // Join exp date error messages in one group
    $.mergeErrorGroups({
        'exp_date_m': 'exp_date',
        'exp_date_y': 'exp_date'
    });

    // Localize toast texts
    var formTimeoutMessage = lang.form_disabled_timeout_message;
    var formSubmitTimoutMessage = lang.form_submit_timout_message;
    var expYearPlaceholder = lang.YY;

    // Post message to parent window (if we in iFrame)
    var postMessage = function(msg, target) {
        return (parent || window).postMessage(msg, target || '*');
    };

    // Show temporary alert
    var showToast = function(msg, template_object) {
        template_object = template_object || {};
        $toast.find('.toast__content').html($.parseTemplate(msg, template_object));
        $toast.addClass('is-active');
    };

    // Number max value
    var lengthToMaxNumber = function(length) {
        var result = '';
        for(var i = 0; i < length; i++) {
            result += '9';
        }
        return result;
    };

    // Update min and max year
    (function () {
        var now = new Date();
        var min_year = now.getFullYear().toString().substr(2,2);
        var now_month = now.getMonth() + 1;
        var max_year = parseInt(min_year, 10) + 12;

        $card_exp_year.attr('min', min_year);
        $card_exp_year.attr('max', max_year);

        $card_exp_year.on('input', function() {
            if($card_exp_year.val() == min_year) {
                $card_exp_month.attr('min', now_month);
            } else {
                $card_exp_month.attr('min', '1');
            }
        });
    })();

    // Stop exp month from being more than 2 letters
    $card_exp_month.on('input', function() {
        var $this = $(this);
        var len = $this.val().length;
        if(len == 1) {
            // Add leading zero to exp month
            if($this.val() != 0 && $this.val() != 1 && $this.val() != 2 && $this.val().substring(0,1) != '0') {
                $this.val('0' + $this.val());
            }
        }
    });

    $card_exp_month.focusout(function() {
        var $this = $(this);
        var len = $this.val().length;
        if(len == 1) {
            // Add leading zero to exp month
            if($this.val() != 0 && $this.val().substring(0,1) != '0') {
                $this.val('0' + $this.val());
                // Trigger validation to remove error message
                $this.validate();
            }
        }
    });

    $(inputs).each(function(index) {
        // Run validation on change
        $(this).validate('change');

        // Speed up by running validation only when value is at length
        $(this).on('input', function(event) {
            var $this = $(this);
            var maxlen = $this.attr('maxlength');

            // Cut value if its longer than maxlength
            if(maxlen < $this.val().length) {
                $this.val($this.val().substring(0, maxlen));
            }

            // Trigger validation when field is filled
            if(maxlen == $this.val().length) {
                $this.trigger('validate');
            }
        });

        $(this).on('focusout', function(event) {
            var $this = $(this);
            if($this.val()) {
                $(this).trigger('validate');
            }
            event.preventDefault();
        });

        // Jump to previous field
        $(this).on('keydown', function(event) {
            var $this = $(this);

            if($this.val() == "") {
                if(event.keyCode == 8) {
                    if(inputs[index-1]) {
                        // Don't remove last digit in previous input
                        setTimeout(function() {
                            // inputs[index-1].focus();
                            inputs[index-1].select();
                        }, 10);
                    }
                }
            }
        });

        $(this).on('keyup', function(event) {
            var $this = $(this);

            if($this.val() == "") {
                if(event.keyCode == 37) {
                    if(inputs[index-1]) {
                        // inputs[index-1].focus(); // TODO: Make sure select() changes focus in supported browsers
                        inputs[index-1].select();
                    }
                } else if(event.keyCode == 39) {
                    if(inputs[index+1]) {
                        // inputs[index+1].focus();
                        inputs[index+1].select();
                    }
                }
            }
        });

        // Jump to next input when data is valid
        $(this).on('valid', function() {
            var $this = $(this);
            $this.removeError();

            for(var i = index+1; inputs[i] && inputs[i].length > 0; i++) {
                if(inputs[i].isValid() == false) {
                    inputs[i].focus();
                    break;
                }
            }

            postMessage({
                event: 'Form Field Filled', metadata: {
                    errors: [{
                        parameter_name: $this.attr('name'),
                    }]
                }
            });
        });

        // Remove errors for skipped fields
        $(this).on('validation-skipped', function() {
            $(this).removeError();
        });

        // Validation errors
        $(this).on('invalid', function(event, rules_failed, rules) {
            var $this = $(this);
            var first_rule = rules_failed.slice(0).shift() || 'default';
            $this.showError(first_rule, rules);
            postMessage({
                event: 'Form Validation Error',
                metadata: {
                    errors: [{
                        parameter_name: $this.attr('name'),
                        rule: rules_failed.join(';'),
                        message: $this.getErrorText()
                    }]
                }
            });
        });
    });

    // Card PAN mask
    $card_pan.mask("0000 0000 0000 0000", {
        maxlength: true
    });

    // Validate exp month when year is valid
    $card_exp_year.on('valid', function() {
        $card_exp_month.validate();
    });

    // Suggest card type
    $card_pan.on("input", function() {
        var card_data = $.suggestCardData($card_pan.val());

        $card_icon.attr('class', '');
        if(card_data) {
            $card_icon.addClass('icon-provider-' + card_data.brand);
            $card_pan.mask(card_data.mask);

            $card_cvc.attr('maxlength', card_data.cvv_length);
            $card_cvc.attr('minlength', card_data.cvv_length);
            $card_cvc.attr('max', lengthToMaxNumber(card_data.cvv_length));

            var pan_spaces = (card_data.mask.match(/[^0]/g) || []).length;
            var pan_minlen = Math.min.apply(Math, card_data.valid_length);
            var pan_maxlen = Math.max.apply(Math, card_data.valid_length) + pan_spaces;

            $card_pan.attr('minlength', pan_minlen);
            $card_pan.attr('maxlength', pan_maxlen);
            $card_pan.attr('pattern', '\\d{' + pan_minlen + ',' + pan_maxlen + '}');

            if($.inArray(card_data.brand, supported_card_brands) !== -1) {
                return;
            }

            $card_pan.showError('unsupportedCardVendor');
        } else {
            $card_icon.addClass('icon-card-front');
        }
    });

    // Guesters for cardholder field
    var stripInputValue = function (regexp, input) {
        var $this = $(input);
        var value = $this.val();
        if (regexp.test(value)) {
            value = value.replace(regexp, '');
            $this.val(value);
        }

        var double_space_regexp = /[ ]{2,}/g;
        if (double_space_regexp.test(value)) {
            value = value.replace(double_space_regexp, ' ');
            $this.val(value);
        }
    };

    var transliterate_map = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'IE', 'Ё': 'E', 'Ж': 'ZH',
        'З': 'Z', 'И': 'I', 'І': 'I', 'Й': 'I', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
        'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH',
        'Щ': 'SHCH', 'Ы': 'Y', 'Ъ': 'IE', 'Э': 'E', 'Ю': 'IU', 'Я': 'IA'
    };

    var transliterateInputValue = function(input) {
        var $input = $(input);
        var result = '';

        $($input.val().split('')).each(function() {
            var chr = $(this)[0].toUpperCase();

            if(transliterate_map[chr]) {
                result += transliterate_map[chr];
            } else {
                result += chr;
            }
        });

        $input.val(result);
    };

    $card_holder.on('input', function() {
        transliterateInputValue($card_holder);
        stripInputValue(/[^ A-z]/gi, $card_holder);
        if($card_holder.isValid()) {
            $card_holder.validate();
        }
    });

    // Catch form validation result and activate/deactivate button
    $form.on('field_valid', function(event) {
        if($form.isValid() == true) {
            $form_submit_btn.removeAttr('disabled').addClass('btn_red active');
        } else {
            $form_submit_btn.removeClass('btn_red active');
        }
    });

    $form.on('field_invalid', function(event) {
        $form_submit_btn.removeClass('btn_red active');
    });

    // Submit form if valid, but show toast first
    $form.data('submit-ready', false);
    $form.on('submit', function(event) {
        if($form.data('submit-ready') === true) {
            postMessage({event: 'Form Submit'});
            // Send HTTP POST
            return true;
        }

        // Cancel POST and do magic
        event.preventDefault();
        if($form.isValid()) {
            $form_submit_btn.attr('disabled', true).removeClass('active');
            $(inputs).each(function(index) {
                $(this).attr('disabled', 'disabled');
            });

            // Fix form data
            $card_holder.val($card_holder.val().toLocaleUpperCase());
            // TODO: check if IPSP accepts short exp year format
            if($card_exp_year.val().substring(0, 2) != '20') {
                $card_exp_year.val('20' + $card_exp_year.val());
            }

            var timer_value = form_submit_timout;
            showToast(formSubmitTimoutMessage, {count: timer_value, seconds: $.getPluralForm(lang.pluralize.seconds, timer_value)});

            var timer = setInterval(function() {
                if(timer_value > 0) {
                    timer_value--;
                    showToast(formSubmitTimoutMessage, {count: timer_value, seconds: $.getPluralForm(lang.pluralize.seconds, timer_value)});
                } else {
                    clearInterval(timer);
                }
            }, 1000);

            $form.data('submit-ready', true);
            setTimeout(function() {
                $form.submit();
            }, form_submit_timout*1000);
            postMessage({event: 'Form Submit Tap', metadata: {valid: true}});
        } else {
            $('.addcard__in').shake();
            $form.validate();
            $form.getFirstInvalid().focus();
            postMessage({event: 'Form Submit Tap', metadata: {valid: false}});
        }
        return false;
    });

    // Focus on first field
    $('input:not(:disabled):not(:hidden):first').focus();

    // Button is red for browsers without JS
    $form_submit_btn.removeClass('btn_red');

    // We use shorter exp year format
    $card_exp_year.attr('min', '15');
    $card_exp_year.attr('max', '27');
    $card_exp_year.attr('minlength', '2');
    $card_exp_year.attr('maxlength', '2');
    $card_exp_year.attr('placeholder', expYearPlaceholder);

    var card_exp_year_value = $card_exp_year.val();
    if(card_exp_year_value && card_exp_year_value.length == 4) {
        $card_exp_year.val(card_exp_year_value.substring(2));
    }

    // Form ready
    postMessage({event: 'Card Add Screen Open'});

    // Show timeout toast
    setTimeout(function() {
        $form_submit_btn.attr('disabled', true).removeClass('active');
        $(inputs).each(function() {
            $(this).attr('disabled', 'disabled');
        });
        showToast(formTimeoutMessage);
    }, form_disabled_timeout*1000);
});
