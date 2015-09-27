var lang = {
    'error_messages': {
        'pan': {
            'required': "Введите номер карты.",
            'pattern': "Введен неверный номер карты.",
            'cardNumber': "Введен неверный номер карты.",
            'minLength': "Номер карты должен быть не короче {{minLength}} цифр.",
            'maxLength': "Номер карты должен содержать не более {{maxLength}} цифр.",
        },
        'cvv': {
            'required': "Введите CVV/CVC2 код.",
            'minLength': "CVV/CVC2 код состоит из {{minLength}} цифр.",
            'maxLength': "CVV/CVC2 код состоит из {{maxLength}} цифр."
        },
        'cardholder': {
            'required': "Введите имя держателя карты.",
            'minLength': "Имя должно содержать как минимум {{minLength}} буквы."
        },
        'exp_date': {
            'required': "Введите срок действия карты.",
            'pattern': "Неверный срок действия карты.",
            'minValue': "Срок действия карты истек.",
            'maxValue': "Срок действия карты слишком большой."
        },
        'default': {
            'default': "Вы ввели неверные данные.",
            'required': "Это поле обязательно к заполнению.",
            'pattern': "Вы ввели неверные данные.",
            'minLength': "Длинна должна содержать не менее {{minLength}} символов.",
            'maxLength': "Длинна должна содержать не более {{maxLength}} символов.",
            'fixLength': "Длинна должна содержать {{fixLength}} символов.",
            'minValue': "Значение должно быть не меньше {{minValue}}.",
            'maxValue': "Значение должно быть не больше {{maxValue}}.",
            'cardNumber': "Введён неверный номер карты.",
            'unsupportedCardVendor': "К оплате принимаются только карты Visa, MasterCard и Maestro."
        }
    },
    'form_disabled_timeout_message': "Время ожидания истекло. Пожалуйста, попробуйте еще раз. Форма должна быть заполнена в течении 15 минут.",
    'form_submit_timout_message': "Через {{count}} {{seconds}} вы будете перенаправлены на страницу 3D Secure вашего банка.",
    'YY': 'ГГ',
    'pluralize': {
        'seconds': [
            'секунду',
            'секунды',
            'секунд'
        ]
    }
}
