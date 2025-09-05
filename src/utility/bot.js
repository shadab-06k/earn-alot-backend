// const { Telegraf, Markup } = require('telegraf');

// const BOT_TOKEN = '7519349460:AAGsgkcWwPy3mGFGmoOA8djGrfth1lb4TCY';
// const WEB_APP_URL = "https://rdm-5vg8.vercel.app/";

// const bot = new Telegraf(BOT_TOKEN);

// bot.start((ctx) => {
//     ctx.reply('Click below to open the Mini App:', 
//         Markup.inlineKeyboard([
//             Markup.button.webApp("Open App", WEB_APP_URL)
//         ])
//     );
// });

// // Handle any text message and provide the button again
// bot.on("message", (ctx) => {
//     ctx.reply('Click below to open the Mini App:', 
//         Markup.inlineKeyboard([
//             Markup.button.webApp("Open App", WEB_APP_URL)
//         ])
//     );
// });

// bot.launch();
// console.log("Telegram Mini App bot is running...");

// const { Telegraf } = require('telegraf');

// const BOT_TOKEN = '7519349460:AAGsgkcWwPy3mGFGmoOA8djGrfth1lb4TCY';
// const bot = new Telegraf(BOT_TOKEN);

// bot.start((ctx) => {
//     const startPayload = ctx.startPayload; // Get the value after ?start=

//     if (startPayload) {
//         // If bot is started with ?start=webapp, send an empty response
//         ctx.reply("🔄 Launching Mini App... Please wait...");
//     }
// });

// bot.launch();
// console.log("✅ Telegram Mini App bot is running...");

// const { Telegraf } = require('telegraf');

// const BOT_TOKEN = '7519349460:AAGsgkcWwPy3mGFGmoOA8djGrfth1lb4TCY';
// const bot = new Telegraf(BOT_TOKEN);

// bot.start((ctx) => {
//     ctx.reply("✅ Launching your Mini App... Please wait...");
// });

// bot.launch();
// console.log("✅ Telegram Mini App bot is running...");

const { Telegraf } = require('telegraf');

console.log("🚀 Bot is initializing..."); // Debug log

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = "https://earn-alot-web-app.vercel.app/";

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    console.log("📩 Received /start command"); // Debug log

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

bot.launch()
    .then(() => console.log("✅ Telegram Earn-Alot App bot is running..."))
    .catch((err) => console.error("❌ Bot launch failed:", err));





