import { Router } from "express";

export const authApi = Router();

authApi.post("/authenticate", (req, res) => {
    const { username, password } = req.body;
    res.send({ success: true, message: "User authenticated" });
});

export function authenticateOwner(user: { username: string; password: string }) {
  console.log(`Authenticating Owner: ${user.username}`);
  // Add your authentication logic here
}