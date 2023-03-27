import { Telegraf, Markup } from 'telegraf';

export function initBotTelegram() {
    const bot = new Telegraf(process.env.TG_BOT_TOKEN)

    bot.start((ctx) => {
        ctx.reply('Привет! Выбери требуемое действие...', Markup.inlineKeyboard([
            Markup.button.callback('Оплатить заказ', 'pay'),
            Markup.button.callback('Проблемы с заказом', 'problem'),
        ]));
    });

    bot.telegram.getMe().then((botInfo) => {
        console.log(`Telegram Bot has been started @${botInfo.username}`);
    }).catch((err) => {
        console.error('Unable to connect to Telegram API:', err);
    });

    bot.launch().then(() => {
        console.log('Bot started');
    }).catch((err) => {
        console.error(err);
    });
}

