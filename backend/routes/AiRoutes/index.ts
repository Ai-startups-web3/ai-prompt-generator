import express from "express";
import {
    GetPrompt,
} from "../../controllers/AI/AiChatController";
import { authenticateUser } from "../../middleware/useAuthenticate";

const router = express.Router();

/**
 * @swagger
 * /ai/getPrompt:
 *   post:
 *     summary: Generate AI prompt response
 *     tags:
 *       - AI
 *     description: Receives a user message and AI type, and returns a generated AI response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userMessage:
 *                 type: string
 *                 example: "Explain smart contracts"
 *               aiType:
 *                 type: string
 *                 example: "ChatGPT"
 *     responses:
 *       201:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aiMessage:
 *                   type: string
 *                   example: "A smart contract is a self-executing contract with the terms written in code."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post("/getPrompt",authenticateUser, GetPrompt);




export default router;