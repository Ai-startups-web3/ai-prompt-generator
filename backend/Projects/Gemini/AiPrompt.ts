import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../../config";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const chatWithGemini = async function* (userMessage: string, history: any[]): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.geminiApiKey) {
            throw new Error("Missing Gemini API Key. Please set GEMINI_API_KEY in your environment variables.");
        }

        const formattedPrompt = generateGeminiPrompt(userMessage);

        const messages = [
            ...history, // Include previous messages
            { role: "user", content: formattedPrompt }
        ];

        const result = await model.generateContentStream({
            contents: messages.map((msg) => ({ role: msg.role, parts: [{ text: msg.content }] })),
          });
      
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
 * Function to generate a LinkedIn post prompt based on JSON data.
 */
function generateGeminiPrompt(userMessage: any): string {
    return `
General Information ${userMessage || "General Information"}
`
}
