var lang = {
    'page': {
        '*': '•',
        '**': '••',
        '***': '•••',
        '**** **** **** ****': '•••• •••• •••• ••••',
    },
    'error_messages': {
        'pan': {
            'required': "Card number is required.",
            'pattern': "Invalid card number.",
            'cardNumber': "Invalid card number.",
            'minLength': "Card number should consist at least {{minLength}} characters.",
            'maxLength': "Card number should consist no more than {{maxLength}} characters.",
        },
        'cvv': {
            'required': "CVV/CVC2 code is required.",
            'minLength': "CVV/CVC2 should be {{minLength}} characters long.",
            'maxLength': "CVV/CVC2 should be {{maxLength}} characters long."
        },
        'cardholder': {
            'required': "Card holder name is required.",
            'minLength': "Card holder should contain at least {{minLength}} letters."
        },
        'exp_date': {
            'required': "Expiration date is required.",
            'pattern': "Wrong expiration date.",
            'minValue': "This card is expired.",
            'maxValue': "Expiration date is too big."
        },
        'default': {
            'default': "Invalid data",
            'required': "This field is required",
            'pattern': "Invalid data",
            'minLength': "This field should consist at least {{minLength}} characters.",
            'maxLength': "This field should consist no more than {{maxLength}} characters.",
            'fixLength': "This field should be {fixLength} characters long.",
            'minValue': "Value should be at least {{minValue}}.",
            'maxValue': "Value should be no more than {{maxValue}}.",
            'cardNumber': "Invalid card number.",
            'unsupportedCardVendor': "We accept only Visa, MasterCard and Maestro cards."
        }
    },
    'form_disabled_timeout_message': "Session time out. Please, try again. You have 15 minutes to submit this form.  <button class='btn btn_red btn_reload'>Reload page</button>",
    'form_submit_timout_message': "In {{count}} {{seconds}} you will be redirected to 3-D Secure page of your bank.",
    'pluralize': {
        'seconds': [
            'second',
            'seconds',
            'seconds'
        ]
    }
}
