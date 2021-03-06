var lang = {
    'page': {
        'payment form': 'форма оплаты',
        'Card number': 'Номер карты',
        'Expiration date': 'Срок действия',
        'CVV code': 'Код CVV',
        'Card holder name': 'Держатель карты',
        'JOHN SMITH': 'IVAN IVANOV',
        'As written on the card': 'Латинскими буквами как указано на карте',
        'The connection is highly secured by the 256-bit algorithm and uses TLS connection.': 'Передача данных шифруется высоконадежным 256-битным алгоритмом и осуществляется посредством TLS протокола.',
        'Continue': 'Продолжить',
        'After clicking "Continue" we will charge your card in amount of': 'После нажатия кнопки «Продолжить» мы снимем с указанной карты',
        'to pay for selected service.': 'для оплаты выбранной услуги.',
        'to make sure that it belongs to you. We will refund this funds withing 24 hours.': 'или эквивалентную сумму, чтобы убедиться, что она принадлежит вам. Мы возместим эти средства на ваш счет в течение 24 часов.',
        'For security purposes we ask you to enter your CVV/CVC2 code each time we charge your card.': 'В целях безопасности мы простим вас вводить CVV/CVC2 код при каждом списании с карты.',
        'MM': 'ММ',
        'YY': 'ГГ',
        'RUB': 'руб.',
        '*': '•',
        '**': '••',
        '***': '•••',
        '**** **** ****': '•••• •••• ••••',
        '**** **** **** ****': '•••• •••• •••• ••••',
    },
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
    'form_disabled_timeout_message': "Время ожидания истекло. Пожалуйста, попробуйте еще раз. Форма должна быть заполнена в течении 15 минут. <button class='btn btn_red btn_reload'>Обновить страницу</button>",
    'form_submit_timout_message': "Через {{count}} {{seconds}} вы будете перенаправлены на страницу 3-D Secure вашего банка.",
    'pluralize': {
        'seconds': [
            'секунду',
            'секунды',
            'секунд'
        ],
        'RUB': [
            'рубль',
            'рубля',
            'рублей'
        ]
    }
}
