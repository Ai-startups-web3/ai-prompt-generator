import axios from "axios";
import config from "../../../config";
import OpenAI from "openai";


const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: config.deepseekApiKey
});


export const chatWithDeepSeek = async function* (userMessage: string, history: any[]): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.deepseekApiKey) {
            throw new Error("Missing DeepSeel API Key. Please set DEEPSEEK_API_KEY in your environment variables.");
        }

        const formattedPrompt = generateDeepSeekPrompt(userMessage);

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
 * Function to generate a LinkedIn post prompt based on JSON data.
 */
function generateDeepSeekPrompt(userMessage: any): string {
    return `
General Information ${userMessage || "General Information"}
`
}
