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

async function startServer() {
    try {
        await getClient();
        logger.info("✅ Successfully connected to the database");

        app.listen(PORT, () => {
            logger.info(`✅ Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error("❌ Failed to connect to the database. Server not started.", { error });
        process.exit(1);
    }
}

// ✅ Run both the bot and the Express server together
startServer();

