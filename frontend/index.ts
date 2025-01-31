import { Router } from "express";

export const frontendApi = Router();

frontendApi.get("/", (req, res) => {
  res.send("Frontend initialized");
});