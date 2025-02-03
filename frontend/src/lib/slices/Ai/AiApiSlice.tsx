import { createAsyncThunk } from '@reduxjs/toolkit';
import { addMessage, setLoading, setActiveHistory } from './AiSlice';
import { ChatMessage } from './AiSlice';
import Request from '../../../Backend/apiCall';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library

export const fetchChatResponse = createAsyncThunk(
  'chat/fetchResponse',
  async ({ userMessage, aiType, historyId }: { userMessage: string, aiType: string, historyId: string }, { dispatch, getState }) => {
    dispatch(setLoading(true));

    // Generate a new history ID if one isn't provided
    let currentHistoryId = historyId;
    if (!currentHistoryId) {
      currentHistoryId = uuidv4();  // Generate a new UUID if historyId is empty
      dispatch(setActiveHistory(currentHistoryId));  // Set the new history as active
    }

    const userNewMessage: ChatMessage = { role: 'user', content: userMessage };
    dispatch(addMessage({ historyId: currentHistoryId, message: userNewMessage }));

        // Get the entire chat history (messages) for the currentHistoryId
        const state:any = getState();
        const history = state.aiChat.histories.find((h: { historyId: string; }) => h.historyId === currentHistoryId);
        
    try {
      const response = await Request({
        endpointId: "AiPrompt",
        data: {
          userMessage,
          aiType,
          historyId: currentHistoryId,
          history
        },
      });

      const botMessage: string = response.message;
      const botMessageObject: ChatMessage = { role: 'assistant', content: botMessage };
      dispatch(addMessage({ historyId: currentHistoryId, message: botMessageObject }));

    } catch (error) {
      console.error('Error fetching response:', error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
