import keys from '../keys/index.js'

const registrationObj = function (email) {
    return {
        api_key: keys.MAIL_API_KEY,
        email: email, // Адрес получателя сообщения
        sender_name: 'Planet Exotic', // Имя отправителя
        sender_email: keys.EMAIL_FROM, // Email отправителя
        subject: 'Аккаунт создан', // Тема письма
        body: `<h1>Добро пожаловать в наш магазин</h1>
             <p>Вы успешно создали аккаунт c email - ${email}</p>
             <hr />
             <a href="${keys.BASE_URL}">Магазин животных</a>`, // Текст в формате html
        list_id: 1, // Код списка
    }
}

export default registrationObj