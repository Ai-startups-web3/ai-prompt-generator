import OpenAI from "openai";
import config from "../../../config";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

export const chatWithGPT = async function* (userMessage: string, history: any[]): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.openAiApiKey) {
            throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
        }

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: userMessage }
        ];

        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
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
