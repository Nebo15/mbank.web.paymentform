(function() {
    var card_types = [
        {
            brand: 'amex',
            name: 'amex',
            pattern: /^3[47]/,
            valid_length: [15],
            cvv_length: 4
        }, {
            brand: 'jcb',
            name: 'jcb',
            pattern: /^35(2[89]|[3-8][0-9])/,
            valid_length: [16],
            cvv_length: 3
        }, {
            brand: 'visa',
            name: 'visa_electron',
            pattern: /^(4026|417500|4508|4844|491(3|7))/,
            valid_length: [16],
            cvv_length: 3
        }, {
            brand: 'visa',
            name: 'visa',
            pattern: /^4/,
            valid_length: [16],
            cvv_length: 3
        }, {
            brand: 'mastercard',
            name: 'mastercard',
            pattern: /^5[1-5]/,
            valid_length: [16],
            cvv_length: 3
        }, {
            brand: 'maestro',
            name: 'maestro',
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvv_length: 3
        }
    ];

    $.suggestCardData = function(number) {
        var suggested_card = null;

        $(card_types).each(function(i, card_type_data) {
            if (number.match(card_type_data.pattern)) {
                suggested_card = card_type_data;
            }
        });

        return suggested_card;
    };
})();
