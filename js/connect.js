(function() {
    // Don't create another connector when one is injected
    if($.paymentFormConnector !== undefined) {
        return;
    }

    var $form = $('.payment__form');
    var $card_pan = $form.find('input[name=pan]');
    var $card_exp_month = $form.find('input[name=exp_date_m]');
    var $card_exp_year = $form.find('input[name=exp_date_y]');
    var $card_cvc = $form.find('input[name=cvv]');
    var $card_holder = $form.find('input[name=cardholder]');
    var $card_icon = $form.find('.paysys i');

    var fields = [
        $card_pan,
        $card_exp_month,
        $card_exp_year,
        $card_cvc,
        $card_holder
    ];

    var getFieldMeta = function(el) {
        var $field = $(el);
        $field.trigger('input');
        return {
            meta: {
                valid: $field.isValid(),
                error: $field.getErrorText()
            },
            value: $field.val()
        };
    }

    $.paymentFormConnector = {
        setCardNumber: function(pan) {
            if(pan) {
                $card_pan.val(pan).trigger('input');
            }
            return getFieldMeta($card_pan);
        },
        setCardHolder: function(card_holder) {
            if(card_holder) {
                $card_holder.val(card_holder);
            }
            return getFieldMeta($card_holder);
        },
        setCVV: function(cvv) {
            if(cvv) {
                $card_cvc.val(cvv);
            }
            return getFieldMeta($card_cvc);
        },
        setExpirationMonth: function(exp_date_m) {
            if(exp_date_m) {
                $card_exp_month.val(exp_date_m);
            }
            return getFieldMeta($card_exp_month);
        },
        setExpirationYear: function(exp_date_y) {
            if(exp_date_y) {
                $card_exp_year.val(exp_date_y);
            }
            return getFieldMeta($card_exp_year);
        },
        getSuggestedCardVendor: function() {
            var vendor = $card_icon.attr('class');
            if(!! vendor == false || vendor == 'icon-card-front') {
                vendor = null;
            } else {
                vendor = vendor.substring(14);
            }

            return {
                vendor: vendor,
            }
        },
        getExpirationValues: function() {
            var months = $.map($expiration_month.children('option'), function(option) {
                           return option.value;
                           });

            var years = $.map($expiration_year.children('option'), function(option) {
                          return option.value;
                          });

            return {
                years: years,
                months: months
            };
        },
        submitPaymentForm: function() {
            var meta = {
                valid: $form.isValid(),
                error_fields: []
            };

            if(meta.valid) {
                $form.data('submit-ready', true);
                // Timeout to allow script return value
                setTimeout(function() {
                    $form.submit();
                }, 500);
            } else {
                $.each(fields, function() {
                    var $field = $(this);
                    if(!$field.isValid()) {
                        meta.error_fields.push($field.attr('name'));
                    }
                });
            }

            return {
                meta: meta,
                submitted: meta.valid,
            };
        }
    };
})();
