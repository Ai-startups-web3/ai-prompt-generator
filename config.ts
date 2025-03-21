import dotenv from "dotenv";
import { Config } from "./DataTypes/interface"
// Load environment variables from .env file
dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || "5000", 10),
  env: process.env.NODE_ENV || "development",

  //admin info
  rootAdmin: process.env.ROOT_ADMIN || "defaultAdmin",
  rootPassword: process.env.ROOT_PASSWORD || "defaultPassword",
  blockchainOwnerPublicKey: process.env.BLOCKCHAIN_OWNER_PUBLIC_KEY || "",
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataApiSecret: process.env.PINATA_API_SECRET || "",

  //api keys
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  lipSyncApiKey: process.env.LIP_SYNC_API_KEY || "",

  // Razorpay Payment Config
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  firebaseCred: process.env.AI_FIREBASE_CREDENTIALS || "",
}

export default config;