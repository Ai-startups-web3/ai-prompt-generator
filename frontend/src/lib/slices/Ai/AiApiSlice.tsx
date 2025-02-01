// chatActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addMessage, setLoading } from './AiSlice';
import { ChatMessage } from './AiSlice';
import Request from '../../../Backend/apiCall';

export const fetchChatResponse = createAsyncThunk(
  'chat/fetchResponse',
  async ({message}: {message:string}, { dispatch }) => {
    dispatch(setLoading(true));

    const userMessage: ChatMessage = { role: 'user', content: message };
    dispatch(addMessage(userMessage)); // Dispatch user message

    try {
      const response = await Request({
        endpointId: "AiPrompt", 
        data: {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
        },
      });

      const botMessage: ChatMessage = response.choices[0].message;
      dispatch(addMessage(botMessage)); // Dispatch bot's response
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);