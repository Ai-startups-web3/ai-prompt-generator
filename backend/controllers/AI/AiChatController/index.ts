import { Request, Response, NextFunction } from "express";
import { chatWithGPT } from "../../../Projects/ChatGpt/AiPrompt";
import { chatWithDeepSeek } from "../../../Projects/Deepseek/AiPrompt";

/**
 * Add new reponse
 * @param req
 * @param res
 * @param next
 */
export const GetPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userMessage, aiType,history } = req.body;
    console.log(history);
    
    const message = await chatWithGPT(userMessage,history.messages); // Make sure this is awaited
    // const message2 = await chatWithDeepSeek(userMessage); // Make sure this is awaited

    res.status(201).json({ message: message });
  } catch (error) {
    next(error); // Pass the error to the next middleware (handleError)
  }
};
