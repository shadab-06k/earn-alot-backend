import { Telegraf, Context } from 'telegraf';
import logger from '../common/logger';

console.log("🚀 Bot is initializing..."); // Debug log

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = "https://earn-alot-web-app.vercel.app/";

if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN environment variable is required');
}

const bot = new Telegraf(BOT_TOKEN);

// Define the context type for better TypeScript support
interface BotContext extends Context {
    payload?: string;
}

bot.start((ctx: BotContext) => {
    console.log("📩 Received /start command"); // Debug log
    logger.info("📩 Received /start command", { userId: ctx.from?.id, username: ctx.from?.username });

    const startPayload = ctx.payload; // Get the value after ?start=
    
    if (startPayload === "webapp") {
        ctx.reply("🚀 Open Your Earn-Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[
                    { text: "🚀 Open Earn-Alot App", web_app: { url: WEB_APP_URL } }
                ]]
            }
        });
    } else {
        ctx.reply("Welcome! Open Your Earn-Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[
                    { text: "🚀 Open App", web_app: { url: WEB_APP_URL } }
                ]]
            }
        });
    }
});

// Handle any other text message
bot.on('text', (ctx: any) => {
    logger.info("📩 Received text message", { 
        userId: ctx.from?.id, 
        username: ctx.from?.username,
        text: ctx.message.text 
    });
    
    ctx.reply("Welcome! Open Your Earn-Alot APP Now", {
        reply_markup: {
            inline_keyboard: [[
                { text: "🚀 Open App", web_app: { url: WEB_APP_URL } }
            ]]
        }
    });
});

// Error handling
bot.catch((err: any, ctx: BotContext) => {
    logger.error("❌ Bot error occurred", { 
        error: err.message, 
        userId: ctx.from?.id,
        username: ctx.from?.username 
    });
    console.error("❌ Bot error:", err);
});

export const startBot = async (): Promise<void> => {
    try {
        await bot.launch();
        logger.info("✅ Telegram Earn-Alot App bot is running...");
        console.log("✅ Telegram Earn-Alot App bot is running...");
    } catch (err) {
        logger.error("❌ Bot launch failed", { error: err });
        console.error("❌ Bot launch failed:", err);
        throw err;
    }
};

export const stopBot = (): void => {
    bot.stop('SIGINT');
    logger.info("🛑 Telegram bot stopped");
    console.log("🛑 Telegram bot stopped");
};

export default bot;
