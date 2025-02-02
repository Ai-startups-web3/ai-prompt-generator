// chatActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addMessage, setLoading } from './AiSlice';
import { ChatMessage } from './AiSlice';
import Request from '../../../Backend/apiCall';

export const fetchChatResponse = createAsyncThunk(
  'chat/fetchResponse',
  async ({userMessage,aiType}: {userMessage:string,aiType:string}, { dispatch }) => {
    dispatch(setLoading(true));

    const userNewMessage: ChatMessage = { role: 'user', content: userMessage };
    dispatch(addMessage(userNewMessage));

    try {
      const response = await Request({
        endpointId: "AiPrompt", 
        data: {
          userMessage,aiType
        },
      });

      const botMessage: string = response.message;
      console.log(botMessage);
      
      const botMessageObject: ChatMessage = { role: 'assistant', content: botMessage };
      dispatch(addMessage(botMessageObject));
    } catch (error) {
      console.error('Error fetching response:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);