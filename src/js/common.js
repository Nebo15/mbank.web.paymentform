(function () {
    var Platform = {};
    Platform.isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
   window.Platform = Platform;
})();
$(document).ready(function () {

    // adding css classes to the body

    (function () {
        document.documentElement.classList.add(Platform.isMobile ? 'mobile' : 'no-mobile');
    })();

    // Masking card number
    var $cardNumber = $("#cardNumber");
    var $card_exp_year = $('#card_exp_date_y');
    var $card_exp_month = $('#card_exp_date_m');
    var $card_code_cvv = $('#code_cvv2');
    var $card_holder = $('#card_holder');

    var $paymentForm = $(".payment__form");
    var $paymentFormCard = $paymentForm.find('.addcard__in');
    var $paymentFormSubmit = $paymentForm.find('.btn_submit');

    var formSubmitted = false;

    function shake (el, dur) {
        el.addClass('shake');
        setTimeout(function () {
            el.removeClass('shake');
        }, dur || 600);
    }

    var $fields = [
        $cardNumber,
        $card_exp_month,
        $card_exp_year,
        $card_code_cvv,
        $card_holder
    ];

    $cardNumber.mask("0000 0000 0000 0000", {
        maxlength: true,
        onComplete: function () {
            $cardNumber.valid();
        }
    }).focus();

    $paymentForm.on('change', function () {
        if (formSubmitted) {
            return;
        }
        var valid = true;
        var validator = $paymentForm.validate();
        $fields.forEach(function (el) {
            valid &= validator.check(el);
        });
        if (valid) {
            $paymentFormSubmit.addClass('active');
        } else {
            $paymentFormSubmit.removeClass('active');
        }
    });
    $card_holder.on('change', function () {
        $(this).valid();
    });

    (function () {
        var $inputs = $('[data-next-input]');
        function prepare (inputs) {
            var els = {},
              el = null,
              attrVal = null,
              name = null;
            inputs.each(function () {
                el = $(this);
                attrVal = el.data('nextInput');
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
                    cur.next = els[cur.current.data('nextInput')].current;
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
            var val = el.val();

            if (!(e.keyCode == 8 && val.length == 0)) {
                return;
            }

            var name = el.attr('name'), next;

            next = els[name].prev;
            if (!next) {
                return;
            }
            defer(function () {
                next.focus();
            });
        });
        $inputs.on('keyup', function (e) {

            if (e.keyCode < 46 || e.keyCode > 90) return;
            var el = $(this);
            if (el.data('nextInputDirection') == 'prev') {
                return;
            }

            var name = el.attr('name'),
                next;

            if (!$paymentForm.validate().check(el)) {
                return;
            }

            next = els[name].next;
            if (!next) {
                return;
            }

            defer(function () {
                next.focus();
            });
        });

    })();

    (function () {
        $card_exp_month.on('keyup', function (e) {
            if (e.keyCode < 46 || e.keyCode > 90) return;
            var val = $(this).val();
            if (val < 2 && val.length !== 2 || !$paymentForm.validate().check(this)) {
                return;
            }
            $card_exp_year.focus();
        });
        var now = new Date();
        var min_year = now.getFullYear().toString().substr(2,2);
        var now_month = now.getMonth() + 1;
        var max_year = 1*min_year + 12;

        $card_exp_year.on('change', function (e) {
           //if ($(this).val())
            var el = $(this),
              val = el.val();
            $card_exp_month.attr('min', val == min_year ? now_month : '1');
            $card_exp_month.valid();
        });

        $card_exp_year.attr('min', min_year);
        $card_exp_year.attr('max', max_year);
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
        }, lang.latin_without_characters);

        jQuery.validator.addMethod('creditcard_minlength', function (value, element, param) {
            value = value.replace(/-/g, "");
            return (this.optional(element) || value.length >= param);
        });

        jQuery.validator.addMethod('creditcard_maxlength', function (value, element, param) {
            value = value.replace(/-/g, "");

            return (this.optional(element) || value.length <= param);
        });

        function postMessage (msg, target) {
            return (parent || window).postMessage(msg, target || '*');
        }
        // animate and disable submit button
        function onFormSubmit () {
            if (formSubmitted) { return; }
            formSubmitted = true;
            $paymentFormSubmit.attr('disabled', formSubmitted);
            $paymentFormSubmit.addClass('submitted');
            $paymentFormSubmit.removeClass('active');

            $card_holder.val($card_holder.val().toUpperCase());
            postMessage('ipsp:cardForm:submitted');

            // disable form fields on submit
            $fields.forEach(function (el){
                el.attr('disabled', 'disabled');
            });
        }
        // Validates with validate plugin
        $paymentForm.validate({
            onkeyup: false,
            invalidHandler: function () {
                postMessage('ipsp:cardForm:invalidFormHandled');
                shake($paymentFormCard);
            },
            submitHandler: function () {
                onFormSubmit();
            },
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
                    maxlength: 2
                },
                exp_date_y: {
                    required: true,
                    maxlength: 2
                },
                code_cvv2: {
                    required: true,
                    minlength: 3,
                    maxlength: 4
                },
                cardholder: {
                    required: true,
                    minlength: 3,
                    latin_without_characters: true
                }
                //street_address: {
                //    required: true,
                //    latin: true
                //},
                //city_address: {
                //    required: true,
                //    latin: true
                //},
                //country: {
                //    required: true
                //},
                //state: {
                //    required: true,
                //    latin_without_characters: true
                //},
                //zip: {
                //    required: true
                //},
                //email: {
                //    required: true,
                //    email: true
                //},
                //phone: {
                //    required: true,
                //    phone: true
                //}
            },
            groups: {
                card_exp_date_m: "exp_date_m exp_date_y"
            },
            messages: {
                pan: {
                    required: lang.card_number_required,
                    rangelength_stripped: function (data) {
                        var text = lang.card_number_length_rule;

                        if (data[0] == data[1]) {
                            text = lang.card_number_length_rule_exact;
                        }

                        return jQuery.validator.format(text, data)
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
                    min: lang.card_exp_date_expired,
                    max: lang.card_exp_date_expired
                },
                exp_date_y: {
                    required: lang.card_exp_date_required,
                    min: lang.card_exp_date_expired,
                    max: lang.card_exp_date_expired
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
            showErrors: function (errorsMap, errorList) {

                if (!errorList.length) {
                    return;
                }
                postMessage('ipsp:cardForm:error:' + JSON.stringify(errorsMap));
                this.defaultShowErrors();
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
                if (element.attr("name") == "phone") error.insertAfter($("input[name=phone]"));
                if (element.attr("name") == "exp_date_m") error.insertAfter($("input[name=exp_date_m]"));
                if (element.attr("name") == "exp_date_y") error.insertAfter($("input[name=exp_date_y]"));
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
        var $cardNumber = $('#cardNumber');
        $cardNumber.on('keyup', function () {
            var $this = $(this);
            var $paysys = $this.siblings('.paysys').find('i');

            $this.validateCreditCard(function (result) {
                if (result == oldDetection) {
                    return;
                }
                if (!result.card_type || !result.card_type.name) { // clear
                    $paysys.attr('class', ''); // TODO add default class 'icon-card-front'
                    return;
                }

                $paysys.addClass('icon-provider-' + result.card_type.name);

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
});
