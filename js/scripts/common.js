$(document).ready(function () {

    // Masking card number
    $("#card_number").mask("0000 0000 0000 0000", {
        maxlength: true
    }).focus();

    var $paymentForm = $(".payment__form");

    (function () {
        var $inputs = $('[data-next-input]');
        function prepare (inputs) {
            var els = {},
              el = null,
              attrVal = null,
              name = null;
            inputs.each(function () {
                el = $(this);
                attrVal = el.attr('data-next-input');
                name = el.attr('name');
                if (!attrVal) {
                    return;
                }
                els[attrVal] = {
                    prev: el
                };
                els[name] = els[name] || {};
                els[name].current = el;
            });
            var cur = null;
            for (var prop in els) {
                cur = els[prop];
                if (cur.current) {
                    cur.next = els[cur.current.attr('data-next-input')].current;
                }
            }
            return els;
        }
        var els = prepare($inputs);
        var defer = function (cb) {
            return setTimeout(cb, 0);
        };
        $inputs.on('keydown', function (e) {
            var el = $(this);
            var val = el.val(),
              name = el.attr('name'),
              next;

            if (e.keyCode == 8 && val.length == 0) { //delete
                next = els[name].prev;
            }
            if (!next) {
                return;
            }

            defer(function () {
                next.focus();
            });
        });
        $inputs.on('keyup', function (e) {
            if (e.keyCode == 8) {
                return;
            }
            var el = $(this);
            var val = el.val(),
              name = el.attr('name'),
              isValid = $paymentForm.validate().check(el),
              next;

            if (e.keyCode < 46 || e.keyCode > 90) return;
            if (isValid) {
                next = els[name].next;
                console.log('next', els[name]);
            }

            if (!next) {
                return;
            }

            defer(function () {
                next.focus();
            });
        });

    })();
    // Validators
    (function () {
        var card_number_regexp = /[^0-9]/g;
        var card_number_visible_regexp = /[^0-9\s]/g;
        var cardholder_regexp = /[^ A-z]/g;
        var phone_regexp = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

        // Removing error
        $("fieldset input").click(function () {
            $("fieldset label.error").remove();
        });

        // Special validators that ignores decorative parts of credit card number
        jQuery.validator.addMethod("rangelength_stripped", function (value, element, param) {
            var rep = card_number_regexp;
            return (this.optional(element) || jQuery.validator.methods.rangelength.call(this, value.replace(rep, ''), element, param));
        }, lang.card_wrong_length);

        jQuery.validator.addMethod("creditcard_stripped", function (value, element, param) {
            var rep = card_number_regexp;
            return (this.optional(element) || jQuery.validator.methods.creditcard.call(this, value.replace(rep, ''), element, param));
        }, lang.card_wrong_number);

        jQuery.validator.addMethod("phone", function (value, element, param) {
            var rep = phone_regexp;

            return (this.optional(element) || rep.test(value));
        }, lang.wrong_phone);

        jQuery.validator.addMethod("latin", function (value, element, param) {
            var rep = /^([A-Za-z0-9\/,\.\-!_ \(\)]+)$/gi;
            return (this.optional(element) || rep.test(value));
        });

        jQuery.validator.addMethod("latin_without_characters", function (value, element, param) {
            var rep = /^([A-Za-z ]+)$/gi;
            return (this.optional(element) || rep.test(value));
        });

        jQuery.validator.addMethod('creditcard_minlength', function (value, element, param) {
            value = value.replace(/-/g, "");
            return (this.optional(element) || value.length >= param);
        });

        jQuery.validator.addMethod('creditcard_maxlength', function (value, element, param) {
            value = value.replace(/-/g, "");

            return (this.optional(element) || value.length <= param);
        });

        // Validates with validate plugin
        $paymentForm.validate({
            onkeyup: false,
            rules: {
                pan: {
                    required: true,
                    rangelength_stripped: [16, 16],
                    creditcard_stripped: true,
                    creditcard_minlength: 12,
                    creditcard_maxlength: 19
                },
                exp_date_m: {
                    required: true,
                    //exp_date: true,
                    maxlength: 2
                },
                code_cvv2: {
                    required: true,
                    minlength: 3,
                    maxlength: 3
                },
                exp_date_y: {
                    required: true,
                    //exp_date: true,
                    maxlength: 2
                },
                cardholder: {
                    required: true,
                    minlength: 3
                },
                street_address: {
                    required: true,
                    latin: true
                },
                city_address: {
                    required: true,
                    latin: true
                },
                country: {
                    required: true
                },
                state: {
                    required: true,
                    latin_without_characters: true
                },
                zip: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                    phone: true
                }
            },
            messages: {
                pan: {
                    required: lang.card_number_required,
                    rangelength_stripped: function (data) {
                        var text = lang.card_number_length_rule;

                        if (data[0] == data[1]) {
                            text = lang.card_number_length_rule_exact;
                        }

                        return jQuery.format(text, data)
                    },
                    creditcard_stripped: lang.card_wrong_number,
                    creditcard_minlength: lang.card_number_minlength,
                    creditcard_maxlength: lang.card_number_maxlength
                },
                code_cvv2: {
                    required: lang.card_cvv2_required,
                    minlength: lang.card_cvv2_length,
                    maxlength: lang.card_cvv2_length
                },
                cardholder: {
                    required: lang.card_holder_required,
                    minlength: lang.card_holder_minlength
                },
                exp_date_m: {
                    required: lang.card_exp_date_required,
                    exp_date: lang.card_exp_date_expired
                },
                exp_date_y: {
                    required: lang.card_exp_date_required,
                    exp_date: lang.card_exp_date_expired
                },
                street_address: {
                    required: lang.street_address_required,
                    latin: lang.street_address_latin
                },
                city_address: {
                    required: lang.city_address_required,
                    latin: lang.city_address_latin
                },
                country: {
                    required: lang.country_required
                },
                state: {
                    required: lang.state_required,
                    latin_without_characters: lang.state_latin
                },
                zip: {
                    required: lang.zip_required
                },
                email: {
                    required: lang.email_required,
                    email: lang.email_wrong
                },
                phone: {
                    required: lang.phone_required,
                    phone: lang.phone_wrong
                }
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "pan") error.insertAfter($("input[name=pan]"));
                if (element.attr("name") == "code_cvv2") error.insertAfter($("input[name=code_cvv2]"));
                if (element.attr("name") == "cardholder") error.insertAfter($("input[name=cardholder]"));
                if (element.attr("name") == "street_address") error.insertAfter($("input[name=street_address]"));
                if (element.attr("name") == "city_address") error.insertAfter($("input[name=city_address]"));
                if (element.attr("name") == "country") error.insertAfter($("input[name=country]"));
                if (element.attr("name") == "state") error.insertAfter($("input[name=state]"));
                if (element.attr("name") == "zip") error.insertAfter($("input[name=zip]"));
                if (element.attr("name") == "email") error.insertAfter($("input[name=email]"));
                if (element.attr("name") == "phone") error.insertAfter($("input[name=phone]"));
            }
        });

        var stripInputValue = function (regexp, input) {
            var $this = $(input);
            setTimeout(function () { // Hack
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
            }, 1);
        };

        // validates - only numbers
        $('.input_onlynumber').on('keypress keyup', function () {
            stripInputValue(card_number_visible_regexp, $(this));
        });

        // validates - only latin letters
        $('.input_latin').on('keypress keyup', function () {
            stripInputValue(cardholder_regexp, $(this));
        });

        // Detect card type
        var oldDetection = null;
        var $cardNumber = $('#card_number');
        $cardNumber.on('keypress keyup', function () {
            var $this = $(this);
            var $paysys = $this.siblings('.paysys').find('i');

            $this.validateCreditCard(function (result) {
                console.log('validate', result.card_type, oldDetection);
                if (result == oldDetection) {
                    return;
                }
                if (!result.card_type || !result.card_type.name) { // clear
                    $paysys.attr('class','');
                    return;
                }

                if (cardDetectionEnabled) {
                    $paysys.addClass(result.card_type.name);

                }
                var max_length = result.card_type.valid_length[result.card_type.valid_length.length - 1];
                $this.rules('add', {
                    rangelength_stripped: [result.card_type.valid_length[0], max_length]
                });

                if (result.card_type.name == "china_unionpay") {
                    $this.rules('remove', "creditcard_stripped");
                } else {
                    $this.rules('add', {
                        creditcard_stripped: true
                    });
                }

                oldDetection = result;
            });
        });
        $cardNumber.trigger('keyup');
    })();

	/*$("select").change(function(){
        var name = $(this).attr('name');
        var form = $(".payment__form");
        if (name.indexOf("exp_date_") != 0) {
            form.validate().element('[name='+name+']');
        } else if (payment_page.exp_date_m.value && payment_page.exp_date_y.value) {
            form.validate().element('[name=exp_date_m]');
            form.validate().element('[name=exp_date_y]');
        }
    })*/
});