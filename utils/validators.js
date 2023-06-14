import checkAPIs from "express-validator"
import User from "../models/user.js";

const {body, validationResult} = checkAPIs

const registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('Такой email уже занят')
                }
            } catch (e) {
                console.log(e)
            }
        }).normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 2, max: 25})
        .withMessage('Имя должно быть минимум 2 символа')
        .trim()
]

const articleValidators = [
    body('title').isLength({min: 3}).withMessage('Минимальная длина названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('quantity').isNumeric().withMessage('Введите корректное количество'),
]

export default {registerValidators, articleValidators}
