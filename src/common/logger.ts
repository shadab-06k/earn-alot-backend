import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const logger = createLogger({
         level: process.env.LOG_LEVEL||'info',
         format:format.combine(
                  format.timestamp({
                           format:'YYYY-MM-DD HH:mm:ss'
                  }),
                  format.json(),
                  format.combine(format.colorize(),format.simple())
         ),
         transports:[
                  new transports.Console(),
         ]
})

export default logger;