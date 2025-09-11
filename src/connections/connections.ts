// const mongoose = require("mongoose")

// const mongoURI=process.env.MONGO_URL


// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI).then((res:any)=>{
//         console.log("Connected To Mongo Successfully")
//     }).catch((error:any)=>{
//         console.log('error encountered',error)
//     });
       
//     }

// module.exports=connectToMongo;


import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import logger from '../common/logger';
dotenv.config();


// const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const url = process.env.MONGO_URL || "mongodb+srv://ShadabK:Shadab%40123@cluster0.xehzuze.mongodb.net/earn-alot?retryWrites=true&w=majority&appName=Cluster0";

let client: MongoClient | null = null;

// Function to get MongoDB client with retry logic
export const getClient = async (): Promise<MongoClient> =>{
  if (client) return client;
  try {
    client = new MongoClient(url);
    await client.connect();
    return client;
  } catch (error) {
    logger.error(' Database connection error', { error });
    throw new Error('Database connection error');
  }
};

export default {getClient};
