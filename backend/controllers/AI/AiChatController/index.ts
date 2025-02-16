import { Request, Response, NextFunction } from "express";
import { chatWithGPT } from "../../../Projects/AI/ChatGpt/AiPrompt";
import OpenAI from "openai";
import config from "../../../../config";
import { chatWithDeepSeek } from "../../../Projects/AI/Deepseek/AiPrompt";
import { chatWithGemini } from "../../../Projects/AI/Gemini/AiPrompt";
import { AuthenticatedRequest } from "../../../middleware/useAuthenticate";
import { v4 as uuidv4 } from "uuid"; // To generate UUIDs
import admin from "firebase-admin";
import { PromptType } from "../../../DataTypes/enums/enum";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

/**
 * Add new response
 * @param req
 * @param res
 * @param next
 */
export const GetPrompt = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userMessage, aiType = "chatgpt", history, promptType = PromptType.TEXT } = req.body;
        console.log(history);

        // Validate promptType
        if (!Object.values(PromptType).includes(promptType)) {
            res.status(400).json({ error: "Invalid response type." });
            return;
        }

        // Generate a historyId if not provided
        const historyId = history.historyId || uuidv4();
        const userId = req.userId; // Assuming user ID is attached to the request

        // Initialize Firebase database reference
        const db = admin.firestore();
        const chatHistoryRef = db.collection("chatHistories").doc(historyId);

        // Check if the historyId and userId already exist in Firebase
        const historyDoc = await chatHistoryRef.get();

        let historyMessages: any[] = [];

        if (historyDoc.exists) {
            const docData = historyDoc.data();
            if (docData?.userId === userId) {
                // If historyId and userId match, get current messages
                historyMessages = docData?.messages || [];
                console.log(`History with ID ${historyId} and userId ${userId} already exists in Firebase.`);
            } else {
                // If the userId doesn't match, handle this case separately
                res.status(400).json({ error: "HistoryId exists, but userId does not match." });
                return;
            }
        } else {
            // If historyId doesn't exist, save new chat info with userId and historyId
            const newMessage = {
                role: "user",
                content: userMessage,
            };
            historyMessages = [newMessage];

            await chatHistoryRef.set({
                userId,
                historyId,
                messages: historyMessages,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`Saved new chat history with ID ${historyId} in Firebase.`);
        }

        // Set response headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Step 1: Always generate a text response first using the selected AI
        let textResponse = "";
        let stream: AsyncIterable<string> | undefined;

        if (aiType == "Deepseek") {
            stream = chatWithDeepSeek(userMessage, historyMessages,promptType);
        } else if (aiType == "Gemini") {
            stream = chatWithGemini(userMessage, historyMessages,promptType);
        } else {
            stream = chatWithGPT(userMessage, historyMessages,promptType);
        }

        if (!stream) {
            throw new Error("Stream is undefined");
        }

        for await (const chunk of stream) {
            textResponse += chunk;
            if (promptType === PromptType.TEXT) {
                // Stream the text response back to the client
                res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
            }
        }

        // Step 2: Use the generated text response for further processing based on promptType
        let finalOutput = textResponse; // Default to text response





        switch (promptType) {
            case PromptType.AUDIO:
                finalOutput = await convertTextToAudio(textResponse);
                res.write(`data: ${JSON.stringify({ message: "Audio conversion complete." })}\n\n`);
                break;

            case PromptType.VIDEO:
                finalOutput = await convertTextToVideo(textResponse);
                res.write(`data: ${JSON.stringify({ message: "Video conversion complete." })}\n\n`);
                break;

            case PromptType.LINKEDIN_PROFILE:
                finalOutput = await convertTextToVideo(textResponse);
                res.write(`data: ${JSON.stringify({ message: "LinkedIn profile video conversion complete." })}\n\n`);
                break;

            case PromptType.TEXT:
                // No further processing needed, already streamed
                break;

            default:
                throw new Error("Unsupported response type.");
        }




        // Save the final output to Firebase
        const newReply = {
            role: "assistant",
            content: finalOutput,
            id: uuidv4(),
            userId: userId,
        };

        await chatHistoryRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(newReply),
        });

        console.log("New reply saved to Firebase.");

        // End the response
        if (!res.writableEnded) {
            res.write("data: [DONE]\n\n");
            res.end();
        }

    } catch (error) {
        next(error);
    }
};


/**
 * Convert text to audio
 */
async function convertTextToAudio(text: string): Promise<string> {
    // Implement text-to-audio conversion logic here
    return "Audio conversion placeholder";
}

/**
 * Convert text to video
 */
async function convertTextToVideo(text: string): Promise<string> {
    // Implement text-to-video conversion logic here
    return "Video conversion placeholder";
}