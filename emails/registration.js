const registrationObj = function (email) {
    return {
        api_key: process.env.MAIL_API_KEY,
        email: email, // Адрес получателя сообщения
        sender_name: 'SmallShop', // Имя отправителя
        sender_email: process.env.EMAIL_FROM, // Email отправителя
        subject: 'Аккаунт создан', // Тема письма
        body: `<h1>Добро пожаловать в наш магазин</h1>
             <p>Вы успешно создали аккаунт c email - ${email}</p>
             <hr />
             <a href="${process.env.BASE_URL}">Купить всякое разное</a>`, // Текст в формате html
        list_id: 1, // Код списка
    }
}

export default registrationObj