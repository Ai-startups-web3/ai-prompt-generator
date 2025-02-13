import { Router } from "express";
import AiRoutes from './routes/AiRoutes';
import PaymentRoutes from './routes/payment';
import handleError from "./middleware/errorHandler";
import express from "express";

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
router.use(
  "/payment",
  PaymentRoutes
);
router.use(handleError);

export default router