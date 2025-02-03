import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library

export interface ChatMessage {
  role: string; 
  // 'user' or 'assistant'
  content: string;
}

export interface ChatHistory {
  historyId: string;
  messages: ChatMessage[];
}

export interface ChatState {
  histories: ChatHistory[];
  loading: boolean;
  activeHistoryId: string | null;
}

const newChatId=uuidv4()

const initialState: ChatState = {
  histories: [
    {
      historyId: newChatId,
      messages: [{ role: 'assistant', content: 'Welcome to your new chat session!' }],
    },
  ],
  activeHistoryId: newChatId,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ historyId: string; message: ChatMessage }>) => {
      const { historyId, message } = action.payload;
      let history = state.histories.find(h => h.historyId === historyId);
      if (!history) {
        history = { historyId, messages: [] };
        state.histories.push(history);
      }
      history.messages.push(message);
    },
    setActiveHistory: (state, action: PayloadAction<string>) => {
      state.activeHistoryId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      const history = state.histories.find(h => h.historyId === action.payload);
      if (history) {
        history.messages = [];
      }
    },
  },
});

export const { addMessage, setLoading,  setActiveHistory, clearMessages  } = chatSlice.actions;

export default chatSlice.reducer;

// Selector to get messages
export const selectChatHistories = (state: { aiChat: ChatState }) => state.aiChat.histories;
export const selectActiveHistoryId = (state: { aiChat: ChatState }) => state.aiChat.activeHistoryId;
export const selectChatMessages = (state: { aiChat: ChatState }) => {
  const activeHistory = state.aiChat.histories.find(h => h.historyId === state.aiChat.activeHistoryId);
  return activeHistory ? activeHistory.messages : [];
};
export const selectLoading = (state: { aiChat: ChatState }) => state.aiChat.loading;
