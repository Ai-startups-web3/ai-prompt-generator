import { Request, Response, NextFunction } from "express";
import { chatWithGPT } from "../../../Projects/ChatGpt/AiPrompt";
import OpenAI from "openai";
import config from "../../../../config";
import { chatWithDeepSeek } from "../../../Projects/Deepseek/AiPrompt";
import { chatWithGemini } from "../../../Projects/Gemini/AiPrompt";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

/**
 * Add new response
 * @param req
 * @param res
 * @param next
 */
export const GetPrompt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userMessage, aiType="chatgpt", history } = req.body;
        console.log(aiType);

        // Set response headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        
        let stream: AsyncIterable<string> | undefined;
        if (aiType=="Deepseek"){
            stream=chatWithDeepSeek(userMessage, history.messages);
        }
        else if (aiType=="Gemini"){
            stream = chatWithGemini(userMessage, history.messages);
        }
        else{
            stream = chatWithGPT(userMessage, history.messages);

        }

        let message = "";

        if (!stream) {
            throw new Error("Stream is undefined");
        }

        for await (const chunk of stream) {
            message += chunk;
            res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
        }



        /**
         * @dev Use the following to provide image later
         */

        // const imagePrompt = generateImagePrompt(message);
        // // Generate an image based on the chat output
        // const imageResponse = await openai.images.generate({
        //     model: "dall-e-3",
        //     prompt: imagePrompt, // Use the chat output as the image prompt
        // });

        // console.log("creating image");
        // console.log(imageResponse.data[0]?.url);

        // Send the image URL as a separate event
        // res.write(`data: ${JSON.stringify({ image: imageResponse.data[0]?.url })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();

    } catch (error) {
        next(error);
    }
};


/**
 * Generate an image prompt for DALL·E based on JSON data
 */
function generateImagePrompt(message: any): string {
    return `
Create a visually engaging image related to the topic: "${message}". 

- The image should represent: ${message} || "a professional concept."}
- Style: Modern, clean, and visually appealing.
- Format: Suitable for LinkedIn posts.
- Avoid text in the image.
`;
}
