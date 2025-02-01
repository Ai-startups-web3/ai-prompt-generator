import dotenv from "dotenv";
import { Config } from "./DataTypes/interface"
// Load environment variables from .env file
dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || "5000", 10),
  env: process.env.NODE_ENV || "development",
  rootAdmin: process.env.ROOT_ADMIN || "defaultAdmin",
  rootPassword: process.env.ROOT_PASSWORD || "defaultPassword",
  blockchainOwnerPublicKey: process.env.BLOCKCHAIN_OWNER_PUBLIC_KEY || "",
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataApiSecret: process.env.PINATA_API_SECRET || "",
};

export default config;