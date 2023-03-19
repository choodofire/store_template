import keys from "../keys/index.js";

const resetPassword = function (email, token) {
    return {
        api_key: keys.MAIL_API_KEY,
        email: email, // Адрес получателя сообщения
        sender_name: 'Planet Exotic', // Имя отправителя
        sender_email: keys.EMAIL_FROM, // Email отправителя
        subject: 'Восстановление доступа', // Тема письма
        body: `<h1>Вы забыли пароль?</h1>
             <p>Если нет, то проигнорируйте данное письмо</p>
             <p>Иначе, нажмите на ссылку ниже</p>
             <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
             <hr />
             <a href="${keys.BASE_URL}">Магазин животных</a>`, // Текст в формате html
        list_id: 1, // Код списка
    }
}

export default resetPassword