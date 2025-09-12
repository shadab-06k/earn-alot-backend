"use strict";
// const mongoose = require("mongoose")
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
// const mongoURI=process.env.MONGO_URL
// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI).then((res:any)=>{
//         console.log("Connected To Mongo Successfully")
//     }).catch((error:any)=>{
//         console.log('error encountered',error)
//     });
//     }
// module.exports=connectToMongo;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../common/logger"));
dotenv_1.default.config();
// const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const url = process.env.MONGO_URL;
// console.log("url", url);
let client = null;
// Function to get MongoDB client with retry logic
const getClient = async () => {
    if (client)
        return client;
    try {
        client = new mongodb_1.MongoClient(url);
        await client.connect();
        return client;
    }
    catch (error) {
        logger_1.default.error(' Database connection error', { error });
        throw new Error('Database connection error');
    }
};
exports.getClient = getClient;
exports.default = { getClient: exports.getClient };
