import { Request, Response, NextFunction } from "express";

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
 
    res.status(201).json({message:"This is ai reply"});
  } catch (error) {
    next(error);
  }
};