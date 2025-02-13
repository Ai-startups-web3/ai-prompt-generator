import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";


var serviceAccount = require("../../ai-prompyt-firebase-adminsdk-fbsvc-442434e46c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://ai-prompyt.firebaseapp.com"
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

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
