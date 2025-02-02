import { Router } from "express";
import AiRoutes from './(routes)/AiRoutes';

export const backendApi = Router();

// Initialize the root admin (optional logic)
export let rootAdmin: { username: string; password: string } | null = null;

export function initializeRootAdmin(username: string, password: string) {
  if (!username || !password) {
    throw new Error("Root admin credentials are missing in environment variables");
  }
  rootAdmin = { username, password };
  console.log(`Root admin '${username}' initialized`);
}

// Add a root route for the backend API
backendApi.get("/", (req, res) => {
  res.send("Backend initialized");
});


backendApi.use(
  "/ai",
  AiRoutes
);