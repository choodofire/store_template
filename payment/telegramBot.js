import { Scenes, Telegraf, session } from 'telegraf';
import { ScenesGenerator } from "./Scenes.js";

export function initBotTelegram() {
    const bot = new Telegraf(process.env.TG_BOT_TOKEN)
    const TG_BOT_ADMIN_CHATID = process.env.TG_BOT_ADMIN_CHATID

    const sceneGen = new ScenesGenerator(TG_BOT_ADMIN_CHATID)

    const startScene = sceneGen.startScene()
    const technicalSupportScene = sceneGen.technicalSupportScene();
    const paymentScene = sceneGen.paymentScene()
    const formPaymentScene = sceneGen.formPaymentScene()

    const stage = new Scenes.Stage([startScene, technicalSupportScene, paymentScene, formPaymentScene])

    bot.use(session())
    bot.use(stage.middleware())

    bot.command('start', async (ctx) => {
        await ctx.scene.enter('start')
    })
    bot.command('payment', async (ctx) => {
        await ctx.scene.enter('payment')
    })
    bot.command('technicalSupport', async (ctx) => {
        await ctx.scene.enter('technicalSupport')
    })

    bot.telegram.getMe().then((botInfo) => {
        console.log(`Telegram Bot started @${botInfo.username}`);
    }).catch((err) => {
        console.error('Unable to connect to Telegram API:', err);
    });

    bot.launch().then(() => {
        console.log('Bot started');
    }).catch((err) => {
        console.error(err);
    });
}

