import OpenAI from "openai";
import config from "../../../../config";
import { PromptType } from "../../../DataTypes/enums/enum";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

export const chatWithGPT = async function* (userMessage: string, history: any[],promptType:PromptType): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.openAiApiKey) {
            throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
        }

        const formattedPrompt = generatePromptBasedOnPromptType(userMessage,promptType);

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: formattedPrompt }
        ];

        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
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
        console.error("Error fetching response from OpenAI:", error);
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
            return `Convert the following text into an audio-friendly format, ensuring it is clear and concise: ${userMessage}. Directely start the answer and user interaction.`

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