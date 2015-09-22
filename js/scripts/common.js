$(document).ready(function () {

    // Masking card number
    $("#card_number").mask("0000-0000-0000-0000-999", {
        maxlength: false
    });

    // jQuery SelectBox usage
    //(function () {
    //    var selects = $("select");
    //    selects.selectBox();
    //    //selects.css("position", "absolute");
    //    //selects.css("display", "inherit");
    //    //selects.css("visibility", "hidden");
    //
    //    $(document).click(function () {
    //        $(".js-drop ul").hide();
    //        $(".js-select-list").hide();
    //        $(".js-select").removeClass("is-active");
    //    });
    //
    //    $(".js-select").each(function () {
    //        var select_list = $(this).parent().find(".js-select-list");
    //        var text = select_list.find("li").first().text();
    //        $(this).find(".js-select-text").text(text);
    //        $(this).click(function (event) {
    //            if ($(this).hasClass("is-active")) {
    //                $(this).removeClass("is-active");
    //                select_list.slideUp("fast");
    //            }
    //            else {
    //                $(".js-select").removeClass("is-active");
    //                $(".js-select-list").hide();
    //                select_list.slideDown("fast");
    //                $(this).addClass("is-active");
    //            }
    //            event.stopPropagation();
    //        });
    //
    //        select_list.find("li").click(function (event) {
    //            var id = $(this).attr("data-id");
    //            var text = $(this).text();
    //            $(this).parent().parent().find(".js-select-text").text(text);
    //            $(this).parent().parent().find(".js-select-input").val(id);
    //            $(this).parent().hide();
    //            $(this).parents(".js-select").removeClass("is-active");
    //            event.stopPropagation();
    //        });
    //    });
    //
    //    $('.js-select').click(function (event) {
    //        event.stopPropagation();
    //    });
    //})();

    // Validators
    (function () {
        var card_number_regexp = /[^0-9]/g;
        var card_number_visible_regexp = /[^0-9\-]/g;
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
        $(".payment__form").validate({
            rules: {
                pan: {
                    required: true,
                    rangelength_stripped: [16, 16],
                    creditcard_stripped: true,
                    creditcard_minlength: 12,
                    creditcard_maxlength: 19
                },
                /*exp_date_m: {
                    required: true,
                    exp_date: true
                },
                exp_date_y: {
                    required: true,
                    exp_date: true
                },*/
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
                cvv: {
                    required: lang.card_cvv2_required,
                    minlength: lang.card_cvv2_length
                },
                cardholder: {
                    required: lang.card_holder_required,
                    minlength: lang.card_holder_minlength
                },
                /*exp_date_m: {
                    required: lang.card_exp_date_required,
                    exp_date: lang.card_exp_date_expired
                },
                exp_date_y: {
                    required: lang.card_exp_date_required,
                    exp_date: lang.card_exp_date_expired
                },*/
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
        $('#card_number').on('keypress keyup', function (event) {
            var $this = $(this);

            $('#card_number').validateCreditCard(function (result) {
                if (result.card_type) {

                    if (cardDetectionEnabled) {
                        $('.card').html('<i class="' + result.card_type.name + '"></i>');
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

                    // Here we can change mask dynamically
                }
            });
        });
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