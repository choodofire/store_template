const resetPassword = function (email, token) {
    return {
        api_key: process.env.MAIL_API_KEY,
        email: email, // Адрес получателя сообщения
        sender_name: 'Planet Exotic', // Имя отправителя
        sender_email: process.env.EMAIL_FROM, // Email отправителя
        subject: 'Восстановление доступа', // Тема письма
        body: `<h1>Вы забыли пароль?</h1>
             <p>Если нет, то проигнорируйте данное письмо</p>
             <p>Иначе, нажмите на ссылку ниже</p>
             <p><a href="${process.env.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
             <hr />
             <a href="${process.env.BASE_URL}">Магазин виниловых пластинок</a>`, // Текст в формате html
        list_id: 1, // Код списка
    }
}

export default resetPassword