"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopBot = exports.startBot = void 0;
const telegraf_1 = require("telegraf");
const logger_1 = __importDefault(require("../common/logger"));
console.log("🚀 Bot is initializing..."); // Debug log
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = "https://earn-alot-web-app.vercel.app/";
if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN environment variable is required');
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.start((ctx) => {
    console.log("📩 Received /start command"); // Debug log
    logger_1.default.info("📩 Received /start command", { userId: ctx.from?.id, username: ctx.from?.username });
    const startPayload = ctx.payload; // Get the value after ?start=
    if (startPayload === "webapp") {
        ctx.reply("🚀 Open Your Earn-Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[
                        { text: "🚀 Open Earn-Alot App", web_app: { url: WEB_APP_URL } }
                    ]]
            }
        });
    }
    else {
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
bot.on('text', (ctx) => {
    logger_1.default.info("📩 Received text message", {
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
bot.catch((err, ctx) => {
    logger_1.default.error("❌ Bot error occurred", {
        error: err.message,
        userId: ctx.from?.id,
        username: ctx.from?.username
    });
    console.error("❌ Bot error:", err);
});
const startBot = async () => {
    try {
        await bot.launch();
        logger_1.default.info("✅ Telegram Earn-Alot App bot is running...");
        console.log("✅ Telegram Earn-Alot App bot is running...");
    }
    catch (err) {
        logger_1.default.error("❌ Bot launch failed", { error: err });
        console.error("❌ Bot launch failed:", err);
        throw err;
    }
};
exports.startBot = startBot;
const stopBot = () => {
    bot.stop('SIGINT');
    logger_1.default.info("🛑 Telegram bot stopped");
    console.log("🛑 Telegram bot stopped");
};
exports.stopBot = stopBot;
exports.default = bot;
