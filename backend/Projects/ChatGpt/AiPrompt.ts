import OpenAI from "openai";
import config from "../../../config";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

export const chatWithGPT = async function* (userMessage: string, history: any[]): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.openAiApiKey) {
            throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
        }

        const formattedPrompt = generateLinkedInPrompt(userMessage);

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: formattedPrompt }
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

/**
 * Function to generate a LinkedIn post prompt based on JSON data.
 */
function generateLinkedInPrompt(userMessage: any): string {
    return `
You are a social media assistant who specializes in writing engaging LinkedIn posts. 

Based on the following data, create a professional and engaging LinkedIn post not more then 120 words:

- **Topic**: ${userMessage || "General Information"}
- **Key Points**:  "Engage, human text, authentic."
- **Tone**: "Professional and engaging"

Make sure the post is compelling, easy to read, and includes a clear message. Avoid hashtags unless necessary.
`;
}

