import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';  // Import UUID library

export interface ChatMessage {
  id: string;
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

const initialChatId=uuidv4()

const initialState: ChatState = {
  histories: [
    {
      historyId: initialChatId,
      messages: [{id: uuidv4(), role: 'assistant', content: 'Welcome to your new chat session!' }],
    },
  ],
  activeHistoryId: initialChatId,
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

    updateContent: (state, action: PayloadAction<{ historyId: string; messageId: string; newContent: string }>) => {
      console.log("logging");
      
      const { historyId, messageId, newContent } = action.payload;
      console.log(historyId,messageId,newContent);
      
      const history = state.histories.find(h => h.historyId === historyId);
      if (history) {
        const message = history.messages.find(m => m.id === messageId);
        if (message) {
          message.content = newContent;
        }
      }
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

export const { addMessage,updateContent, setLoading,  setActiveHistory, clearMessages  } = chatSlice.actions;

export default chatSlice.reducer;

// Selector to get messages
export const selectChatHistories = (state: { aiChat: ChatState }) => state.aiChat.histories;
export const selectActiveHistoryId = (state: { aiChat: ChatState }) => state.aiChat.activeHistoryId;
export const selectChatMessages = (state: { aiChat: ChatState }) => {
  const activeHistory = state.aiChat.histories.find(h => h.historyId === state.aiChat.activeHistoryId);
  return activeHistory ? activeHistory.messages : [];
};
export const selectLoading = (state: { aiChat: ChatState }) => state.aiChat.loading;
