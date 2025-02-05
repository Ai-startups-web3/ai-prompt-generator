import { Request, Response, NextFunction } from "express";
import { chatWithGPT } from "../../../Projects/ChatGpt/AiPrompt";

/**
 * Add new response
 * @param req
 * @param res
 * @param next
 */
export const GetPrompt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userMessage, aiType, history } = req.body;
        console.log(history);

        // Set response headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = chatWithGPT(userMessage, history.messages);

        for await (const chunk of stream) {
            console.log(chunk);
            
            res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        next(error);
    }
};
