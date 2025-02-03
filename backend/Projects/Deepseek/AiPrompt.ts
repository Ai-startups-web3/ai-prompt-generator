import axios from "axios";
import config from "../../../config";

const DEEPSEEK_KEY = config.deepseekApiKey
const DEEPSEEK_URL = "https://api.openai.com/v1/chat/completions";

export const chatWithDeepSeek = async (userMessage: string): Promise<string | null> => {
    try {
        if (!DEEPSEEK_KEY) {
            throw new Error("Missing Deepseek API Key. Please set DEEPSEEK_KEY in your environment variables.");
        }
        const response = await axios.post(
            DEEPSEEK_URL,
            {
                model: "deepseek-4o-mini",
                messages: [{ role: "user", content: userMessage }],
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DEEPSEEK_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        throw error;
    }
};
