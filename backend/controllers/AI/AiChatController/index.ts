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

        // Step 1: Always generate a text response first using the selected AI
        let textResponse = "";
        let stream: AsyncIterable<string> | undefined;

        if (aiType == "Deepseek") {
            stream = chatWithDeepSeek(userMessage, historyMessages, promptType);
        } else if (aiType == "Gemini") {
            stream = chatWithGemini(userMessage, historyMessages, promptType);
        } else {
            stream = chatWithGPT(userMessage, historyMessages, promptType);
        }

        if (!stream) {
            throw new Error("Stream is undefined");
        }

        for await (const chunk of stream) {
            textResponse += chunk;
            if (promptType === PromptType.TEXT || promptType === PromptType.LINKEDIN_PROFILE || promptType === PromptType.LINKEDIN_POST) {
                // Stream the text response back to the client
                res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
            }
        }

        // Step 2: Use the generated text response for further processing based on promptType
        let finalOutput = textResponse; // Default to text response

        switch (promptType) {
            case PromptType.VIDEO:
                // Stream audio response
                const audioStream = await convertTextToAudioStream(textResponse);
                res.setHeader("Content-Type", "audio/mpeg"); // Set the appropriate content type for audio
                res.setHeader("Cache-Control", "no-cache");
                res.setHeader("Connection", "keep-alive");

                for await (const chunk of audioStream) {
                    res.write(chunk);
                }
                res.end();
                return; // Exit the function after streaming audio

                case PromptType.AUDIO:
                    const videoUrl = await convertTextToVideoStream(textResponse);
                    if (videoUrl) {
                        res.write(`data: ${JSON.stringify({ message: "Video conversion complete.", videoUrl })}\n\n`);
                    } else {
                        res.write(`data: ${JSON.stringify({ error: "Video conversion failed." })}\n\n`);
                    }
                    break;
                

            case PromptType.TEXT:
                // No further processing needed, already streamed
                break;
            case PromptType.LINKEDIN_PROFILE:
                // No further processing needed, already streamed
                break;
            case PromptType.LINKEDIN_POST:
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
 * Convert text to audio stream using OpenAI's TTS API
 */
async function convertTextToAudioStream(text: string): Promise<AsyncIterable<Uint8Array>> {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy", // Choose a voice: alloy, echo, fable, onyx, nova, or shimmer
        input: text,
        response_format: "mp3", // Stream as MP3
    });

    return mp3.body as unknown as AsyncIterable<Uint8Array>;
}
/**
 * Convert text to video stream using OpenAI's TTS API
 */
async function convertTextToVideoStream(text: string): Promise<string | null> {
    try {
        const textUrl = await uploadTextToStorage(text); // Upload text and get the storage URL

        console.log("textUrl");
        console.log(textUrl);
        
        
        const options = {
            method: "POST",
            headers: {
                "x-api-key": config.lipSyncApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "lipsync-1.7.1",
                input: [
                    { type: "video", url: "https://prod-private-sync-user-inputs.s3.us-east-1.amazonaws.com/org-ebde417a-2179-4847-b0f5-fe04249630f3/user-ebde417a-2179-4847-b0f5-fe04249630f3/video-input-1739625585.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWHRN73AZOHOWI6XJ%2F20250215%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250215T131954Z&X-Amz-Expires=604800&X-Amz-Signature=778816fe5fde444632fb54ac533513cfc39b2231a3324c3abe2d647c4dd9f26a&X-Amz-SignedHeaders=host&x-id=GetObject" },
                    { type: "audio", url: textUrl }, // Pass text file URL here
                ],
                options: { output_format: "mp4", output_resolution: [1280, 720] },
                webhookUrl: "https://your-server.com/webhook",
            }),
        };

        const response = await fetch("https://api.sync.so/v2/generate", options);
        const data = await response.json();

        if (!data.id) {
            console.error("Error: No valid ID returned from API.");
            return null;
        }

        console.log(`Video processing started with ID: ${data.id}`);

        // Poll the API to check if the video is ready
        return await pollForVideoCompletion(data.id);
    } catch (error) {
        console.error("Error in convertTextToVideoStream:", error);
        return null;
    }
}

/**
 * Polls the API until the video processing is complete
 */
async function pollForVideoCompletion(jobId: string, maxRetries = 50, delay = 5000): Promise<string | null> {
    const url = `https://api.sync.so/v2/generate/${jobId}`;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "x-api-key": config.lipSyncApiKey,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.status === "COMPLETED" && data.outputUrl) {
                console.log("Video is ready:", data.outputUrl);
                return data.outputUrl;
            } else if (data.status === "FAILED") {
                console.error("Video processing failed:", data.error);
                return null;
            }

            console.log(`Video processing status: ${data.status}, retrying...`);
        } catch (error) {
            console.error("Error polling for video completion:", error);
        }
    }

    console.error("Video processing timed out.");
    return null;
}


/**
 * Upload text to Firebase Storage and get a downloadable URL
 */
async function uploadTextToStorage(text: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `texts/${Date.now()}.txt`; // Unique file name
    const file = bucket.file(fileName);

    await file.save(text, {
        metadata: {
            contentType: "text/plain", // Set the content type
        },
    });

    // Generate a signed URL (valid for 7 days)
    const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // URL expires in 7 days
    });

    return url;
}
