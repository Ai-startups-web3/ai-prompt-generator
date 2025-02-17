import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../../config";
import { PromptType } from "../../../DataTypes/enums/enum";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Api docs for Gemini
// https://ai.google.dev/gemini-api/docs/text-generation?lang=node

export const chatWithGemini = async function* (userMessage: string, history: any[],promptType:PromptType): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.geminiApiKey) {
            throw new Error("Missing Gemini API Key. Please set GEMINI_API_KEY in your environment variables.");
        }

        const formattedPrompt = generatePromptBasedOnPromptType(userMessage,promptType);

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: formattedPrompt }
        ];

        const result = await model.generateContentStream(formattedPrompt);
      
          for await (const chunk of result.stream) {
            const chunkText = await chunk.text(); // Extract chunk text
            if (chunkText) {
              yield chunkText;
            }
          }

    } catch (error) {
        console.error("Error fetching response from Gemini:", error);
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
            return `Be a specialist based on user Input. Be casual and answer the user like a human: ${userMessage}`;

        case PromptType.LINKEDIN_PROFILE:
            return `Generate a professional LinkedIn profile summary based on the following information. Highlight key skills, experiences, and achievements: ${userMessage}`;

        case PromptType.LINKEDIN_POST:
            return `Create an engaging LinkedIn post based on the following content. Ensure it is professional, concise, and includes a call-to-action: ${userMessage}`;
  
        default:
            throw new Error("Unsupported prompt type.");
    }
}