import { Markup, Scenes } from "telegraf";
import Order from "../models/order.js";

export class ScenesGenerator {
    constructor(admin_chatId) {
        this.admin_chatId = Number(admin_chatId);
    }

    startScene() {
        const start = new Scenes.BaseScene('start')

        start.action('technicalSupport', async (ctx) => {
            await ctx.scene.enter('technicalSupport')
        })
        start.action('payment', async (ctx) => {
            await ctx.scene.enter('payment')
        })

        start.enter(async (ctx) => {
            await ctx.reply('Привет! Выбери требуемое действие: ', Markup.inlineKeyboard([
                Markup.button.callback('Оплатить заказ', 'payment'),
                Markup.button.callback('Техническая поддержка', 'technicalSupport'),
            ]));
        })
        return start
    }

    technicalSupportScene() {
        const technicalSupport = new Scenes.BaseScene('technicalSupport')
        technicalSupport.enter(async (ctx) => {
            await ctx.reply('Техническая поддержка.\nВведи "/end", что вернуться в главное меню.')
            await ctx.reply('Объясните одним сообщением свою проблему')
        })
        technicalSupport.command('end', async (ctx) => {
            await ctx.scene.enter('start')
        })
        technicalSupport.on('text', async (ctx) => {
            const message = ctx.message.text;
            if (!message) {
                await ctx.reply('Получена пустая строка, введите проблему снова')
                await ctx.scene.reenter()
            }
            await ctx.reply(`Полученное сообщение: ${message}. Скоро вам пришлют ответ специалисты`)

            const fromUser = ctx.message.chat.username
            await ctx.telegram.sendMessage(this.admin_chatId, `Сообщение от ${fromUser}.\nТекст: ${message}`)
            await ctx.scene.enter('start')
        })
        technicalSupport.on('message', async (ctx) => {
            await ctx.reply('Опишите текстом вашу проблему')
            await ctx.scene.reenter()
        })
        return technicalSupport
    }

    paymentScene() {
        const payment = new Scenes.BaseScene('payment')
        payment.enter(async (ctx) => {
            await ctx.reply('Оплата заказа.\nВведи "/end", что вернуться в главное меню.\n\nВведите свой номер заказа')
        })
        payment.command(['end', 'start', 'technicalSupport'], async (ctx) => {
            await ctx.scene.enter('start')
        })
        payment.on('text', async (ctx) => {
            const message = ctx.message.text;
            if (!message) {
                await ctx.reply('Получена пустая строка, введите проблему снова')
                await ctx.scene.reenter()
            }
            let order = {}
            try {
                order = await Order.findById(message).lean()
            } catch (e) {
                await ctx.reply('Заказ не найден')
                await ctx.scene.reenter()
            }

            if (!order) {
                await ctx.reply('Заказ не найден')
                await ctx.scene.reenter()
            }
            await ctx.reply(`Заказ найден на пользователя: ${order.user.name}`)
            const price = order.vinyls.reduce((total, c) => {return total += c.count * c.vinyl.price}, 0)
            ctx.session.price = price
            await ctx.scene.enter('formPayment')
        })

        payment.on('message', async (ctx) => {
            await ctx.reply('Введите текст')
            await ctx.scene.reenter()
        })
        return payment
    }

    formPaymentScene() {
        const formPayment = new Scenes.BaseScene('formPayment')
        formPayment.enter(async (ctx) => {
            const price = ctx.session.price
            await ctx.reply(`Цена: ${price}.`)
        })
        return formPayment
    }

    checkPaymentScene() {

    }
}