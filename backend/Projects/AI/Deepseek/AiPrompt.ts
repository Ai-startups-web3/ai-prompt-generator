import axios from "axios";
import config from "../../../../config";
import OpenAI from "openai";
import { PromptType } from "../../../DataTypes/enums/enum";

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: config.deepseekApiKey
});


export const chatWithDeepSeek = async function* (userMessage: string, history: any[], promptType:PromptType): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.deepseekApiKey) {
            throw new Error("Missing DeepSeel API Key. Please set DEEPSEEK_API_KEY in your environment variables.");
        }

        const formattedPrompt = generatePromptBasedOnPromptType(userMessage,promptType);

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: formattedPrompt }
        ];

        const stream = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages,
            temperature: 0.7,
            stream: true, // Enable streaming
        });

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
                yield delta; // Send each streamed piece
            }
        }
    } catch (error) {
        console.error("Error fetching response from Deepseek:", error);
        throw error;
    }
};


/**
 * Function to generate a prompt based on the prompt type and user message.
 */
export function generatePromptBasedOnPromptType(userMessage: any, promptType: PromptType): string {
    switch (promptType) {
        case PromptType.TEXT:
            return `Generate a detailed text response for the following input: ${userMessage}`;

        case PromptType.AUDIO:
            return `Convert the following text into an audio-friendly format, ensuring it is clear and concise: ${userMessage}`;

        case PromptType.VIDEO:
            return `Create a video script based on the following text. Include scene descriptions and dialogue where necessary: ${userMessage}`;

        case PromptType.LINKEDIN_PROFILE:
            return `Generate a professional LinkedIn profile summary based on the following information. Highlight key skills, experiences, and achievements: ${userMessage}`;

        case PromptType.LINKEDIN_POST:
            return `Create an engaging LinkedIn post based on the following content. Ensure it is professional, concise, and includes a call-to-action: ${userMessage}`;
  
        default:
            throw new Error("Unsupported prompt type.");
    }
}