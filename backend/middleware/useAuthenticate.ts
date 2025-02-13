import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";


initializeApp({
    credential: applicationDefault(),
    projectId: "ai-prompyt",
  });
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => { 
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    console.log("Received token:", token); // Log the token to debug

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
