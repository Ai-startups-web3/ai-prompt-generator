import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  role: string; 
  // 'user' or 'assistant'
  content: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
}

const initialState: ChatState = {
  messages: [{ role: 'assistant', content: `Ask me anything and get instant responses! Im here to help you explore information and find answers.`}],
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setLoading, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;

// Selector to get messages
export const selectChatMessages = (state: { aiChat: ChatState }) => state.aiChat.messages;
export const selectLoading = (state: { aiChat: ChatState }) => state.aiChat.loading;