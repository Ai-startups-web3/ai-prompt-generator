import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const chatWithGPT = async (userMessage: string): Promise<string | null> => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
        }
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: userMessage }],
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        throw error; // Ensure the error is thrown so it can be caught by the catch block in GetPrompt
    }
};
