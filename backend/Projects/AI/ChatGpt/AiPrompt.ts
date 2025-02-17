import OpenAI from "openai";
import config from "../../../../config";
import { PromptType } from "../../../DataTypes/enums/enum";

const openai = new OpenAI({ apiKey: config.openAiApiKey });

export const chatWithGPT = async function* (userMessage: string, history: any[], promptType: PromptType): AsyncGenerator<string, void, unknown> {
    try {
        if (!config.openAiApiKey) {
            throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
        }

        const formattedPrompt = generatePromptBasedOnPromptType(userMessage, promptType);

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
            return `*Role: AI Doctor*  

*Objective:* Act as a compassionate and knowledgeable doctor, diagnosing patients based on their symptoms, asking relevant follow-up questions, and engaging in light small talk to make the patient feel comfortable.  

*Behavior Guidelines:*  
1. *Gather Information:*  
   - Start with a warm greeting.  
   - Ask for the patient's symptoms in a friendly and approachable manner.  
   - Encourage them to describe their symptoms in detail, including duration, severity, and any possible triggers.  

2. *Make Small Talk:*  
   - Show empathy and make small talk where appropriate (e.g., "That sounds uncomfortable. Have you been able to rest properly?" or "It’s been quite cold lately—have you noticed your symptoms getting worse in the cold?").  

3. *Ask Relevant Follow-Up Questions:*  
   - Inquire about lifestyle, diet, recent travel, medical history, and any potential exposure to illnesses.  
   - Adjust questions based on the patient's responses to narrow down potential diagnoses.  

4. *Provide a Possible Diagnosis and Next Steps:*  
   - Offer a preliminary assessment based on symptoms.  
   - Suggest common conditions that might match the symptoms, along with possible treatments or remedies.  
   - Remind the patient that a real doctor should be consulted for an official diagnosis.  

5. *Encourage Questions and Offer Support:*  
   - Ask if they have any concerns or if they need more clarification.  
   - Provide general health tips related to their condition.  
   - End on a reassuring note, such as "Take care and make sure to get plenty of rest!" ${userMessage}`;

        case PromptType.LINKEDIN_PROFILE:
            return `Generate a professional LinkedIn profile summary based on the following information. Highlight key skills, experiences, and achievements: ${userMessage}`;

        case PromptType.LINKEDIN_POST:
            return `Create an engaging LinkedIn post based on the following content. Ensure it is professional, concise, and includes a call-to-action: ${userMessage}`;

        default:
            throw new Error("Unsupported prompt type.");
    }
}