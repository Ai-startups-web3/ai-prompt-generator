import { Request, Response, NextFunction } from "express";
import { chatWithGPT } from "../../../Projects/ChatGpt/AiPrompt";

/**
 * Add a new course
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
    const { userMessage, aiType } = req.body;

    const message = await chatWithGPT(userMessage); // Make sure this is awaited

    res.status(201).json({ message: message });
  } catch (error) {
    next(error); // Pass the error to the next middleware (handleError)
  }
};
