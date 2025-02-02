import { Router } from "express";
import AiRoutes from './routes/AiRoutes';
import handleError from "./middleware/errorHandler";
import express from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ErrorObject } from "./DataTypes/types/IUserType";
const router = express.Router({ mergeParams: true });

// Initialize the root admin (optional logic)
export let rootAdmin: { username: string; password: string } | null = null;

export function initializeRootAdmin(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Root admin credentials are missing in environment variables");
  }
  rootAdmin = { username, password };
  console.log(`Root admin '${username}' initialized`);
}


router.use(
  "/ai",
  AiRoutes
);
router.use(handleError);

export default router