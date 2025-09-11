"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var cors = require("cors");
const express = require("express");
const logger_1 = __importDefault(require("./common/logger"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const poolRoutes_1 = __importDefault(require("./routes/poolRoutes"));
const lottery_1 = __importDefault(require("./routes/lottery"));
const connections_1 = require("./connections/connections");
const morgan_1 = __importDefault(require("morgan"));
const commonmiddleware_1 = __importDefault(require("./middleware/commonmiddleware"));
const telegraf_1 = require("telegraf");
const app = express();
const PORT = process.env.PORT;
// Middleware
app.use(cors());
app.use(express.json());
app.use(commonmiddleware_1.default);
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim()),
    },
}));
//User Routes
app.use('/api/users', userRoutes_1.default);
app.use("/api/lottery", lottery_1.default);
//Pool Routes
app.use('/api/pools', poolRoutes_1.default);
// Available Routes
app.get("/", (req, res, next) => {
    res.send("Welcome to Earn Alot Tg Mini App Backend");
});
console.log("🚀 Initializing bot & server...");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const WEB_APP_URL = "https://earn-alot-web-app.vercel.app/";
// ✅ Initialize Telegram bot
bot.help((ctx) => {
    ctx.reply('This is a help message.');
});
bot.launch().then(() => console.log('Bot started!')).catch((err) => console.error('Bot failed to start', err));
// ✅ Properly Extract Payload from /start Command
bot.start((ctx) => {
    console.log("📩 Received /start command");
    // ✅ Ensure ctx.message is a text message before accessing `text`
    const message = ctx.message;
    const messageText = message?.text || ""; // Extract text safely
    const startPayload = messageText.split(" ")[1] || ""; // Extract text after `/start`
    console.log('startPayload==>>', startPayload);
    if (startPayload === "webapp") {
        ctx.reply("🚀 Open Your Earn Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[{ text: "🚀 Open Earn Alot App", web_app: { url: WEB_APP_URL } }]],
            },
        });
    }
    else {
        ctx.reply("Welcome! Open Your Earn Alot APP Now", {
            reply_markup: {
                inline_keyboard: [[{ text: "🚀 Open App", web_app: { url: WEB_APP_URL } }]],
            },
        });
    }
});
async function startServer() {
    try {
        await (0, connections_1.getClient)();
        logger_1.default.info("✅ Successfully connected to the database");
        app.listen(PORT, () => {
            logger_1.default.info(`✅ Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error("❌ Failed to connect to the database. Server not started.", { error });
        process.exit(1);
    }
}
// ✅ Run both the bot and the Express server together
startServer();
