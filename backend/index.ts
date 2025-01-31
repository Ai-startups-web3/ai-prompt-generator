import { Router } from "express";

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

backendApi.post("/getPrompt", (req, res) => {
  const { userText } = req.body;
  // You can process userText here if needed
  const response = `Your AI FOR THE DAY IS: 'You are a great person'`;
  res.json({ message: response });
});