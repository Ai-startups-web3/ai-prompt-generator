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