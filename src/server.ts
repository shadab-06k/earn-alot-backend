require("dotenv").config();
var cors = require("cors");
const express = require("express");
import logger from "./common/logger";
import userRoutes from './routes/userRoutes'
import poolRoutes from './routes/poolRoutes'
import lotteryRoutes from './routes/lottery'
import { getClient } from "./connections/connections";
import morgan from 'morgan';
import commonMiddleware from './middleware/commonmiddleware';
import { startBot, stopBot } from './utility/bot';
import { Context, Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import CronJobService from './services/cronJob';




const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(commonMiddleware);
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

//User Routes
app.use('/api/users', userRoutes);
app.use("/api/lottery", lotteryRoutes);

//Pool Routes
app.use('/api/pools', poolRoutes);

// Available Routes
app.get("/", (req: any, res: any, next: any) => {
  res.send("Welcome to Earn Alot Tg Mini App Backend");
});

console.log("🚀 Initializing bot & server...");
const BOT_TOKEN:any = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);
// const WEB_APP_URL:any = "https://earn-alot-web-app.vercel.app/";
const WEB_APP_URL:any = "https://app.earnalot.io/";

// ✅ Initialize Telegram bot
bot.help((ctx: Context) => {
    ctx.reply('This is a help message.');
});

bot.launch().then(() => console.log('Bot started!')).catch((err) => console.error('Bot failed to start', err));


// ✅ Properly Extract Payload from /start Command
bot.start((ctx: Context) => {
    console.log("📩 Received /start command");

    // ✅ Ensure ctx.message is a text message before accessing `text`
    const message = ctx.message as Message.TextMessage | undefined;
    const messageText = message?.text || ""; // Extract text safely
    const startPayload = messageText.split(" ")[1] || ""; // Extract text after `/start`
    console.log('startPayload==>>',startPayload)

    if (startPayload === "webapp") {
        ctx.reply("🚀 Open Your Earn Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[{ text: "🚀 Open Earn Alot App", web_app: { url: WEB_APP_URL } }]],
            },
        });
    } else {
        ctx.reply("Welcome! Open Your Earn Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[{ text: "🚀 Open App", web_app: { url: WEB_APP_URL } }]],
            },
        });
    }
});


async function startServer() {
    try {
        await getClient();
        logger.info("✅ Successfully connected to the database");
        
        // Initialize and start cron job service
        const cronJobService = new CronJobService();
        await cronJobService.startCronJob();
        logger.info("✅ Cron job service started");
        
        app.listen(PORT,'127.0.0.1', () => {
            logger.info(`✅ Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error("❌ Failed to connect to the database. Server not started.", { error });
        process.exit(1);
    }
}

// ✅ Run both the bot and the Express server together
startServer();

