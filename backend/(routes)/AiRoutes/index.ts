import express from "express";
import {
    GetPrompt,
} from "../../controllers/AI/AiChatController";

const router = express.Router();

router.post("/getPromt", GetPrompt);

export default router;