import { Key, useState } from 'react';
import { TextField, Button, Typography, Box, Paper, InputAdornment, FormControl, InputLabel, MenuItem, Select, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchChatResponse } from '../../lib/slices/Ai/AiApiSlice';
import { selectChatMessages, selectLoading, selectChatHistories, selectActiveHistoryId, setActiveHistory } from '../../lib/slices/Ai/AiSlice';
import { AIModel } from '../../Datatypes/enums';
import { MarkdownBlock } from '../Markdown';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { addMessage } from '../../lib/slices/Ai/AiSlice';

const AiPromptGenerator = () => {
  const [input, setInput] = useState('');
  const [selectedAI, setSelectedAI] = useState('Deepseek');
  const [error, setError] = useState('');

  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const messages = useSelector(selectChatMessages);
  const histories = useSelector(selectChatHistories);
  const activeHistoryId = useSelector(selectActiveHistoryId);

  // Function to handle new chat creation
  const handleNewChat = () => {
    const newHistoryId = uuidv4(); // Generate unique ID
    dispatch(addMessage({ historyId: newHistoryId, message: { role: 'assistant', content: 'New chat started!' } }));
    dispatch(setActiveHistory(newHistoryId)); // Set new history as active
  };

  const handleSendMessage = () => {
    if (!selectedAI) {
      setError('Please select an AI.');
      return;
    }
    if (!input.trim()) {
      setError('Please enter some input.');
      return;
    }
    setError('');
    dispatch(fetchChatResponse({ userMessage: input, aiType: selectedAI, historyId: activeHistoryId || "" }));
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: '20px', maxWidth: 600 }}>
      <Paper elevation={3} sx={{ overflowY: 'auto', padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h5" sx={{ marginBottom: '16px', textAlign: 'center' }}>
          Chat with AI
        </Typography>

        {/* AI Selection Dropdown */}
        <FormControl sx={{ mt: 2 }}>
          <InputLabel id="ai-select-label">Select AI</InputLabel>
          <Select labelId="ai-select-label" id="ai-select" value={selectedAI} onChange={(e) => setSelectedAI(e.target.value)}>
            <MenuItem value={AIModel.Deepseek}>{AIModel.Deepseek}</MenuItem>
            <MenuItem value={AIModel.ChatGPT}>{AIModel.ChatGPT}</MenuItem>
            <MenuItem value={AIModel.Gemini}>{AIModel.Gemini}</MenuItem>
          </Select>
        </FormControl>

        {/* Chat History Selector */}
        <FormControl sx={{ mt: 2, width: '100%' }}>
          <InputLabel id="history-select-label">Select Chat</InputLabel>
          <Select
            labelId="history-select-label"
            id="history-select"
            value={activeHistoryId || ''}
            onChange={(e) => dispatch(setActiveHistory(e.target.value))}
          >
            {histories.map((history) => (
              <MenuItem key={history.historyId} value={history.historyId}>
                {history.historyId.slice(0, 8)}...
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* New Chat Button */}
        <Button variant="contained" onClick={handleNewChat} sx={{ mt: 2, width: '100%' }}>
          + New Chat
        </Button>

        {/* Display error message if any */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Chat Messages */}
        <Box>
          {messages.map((message: { role: string; content: any; }, index: Key | null | undefined) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', margin: '8px 0', textAlign: message.role === 'user' ? 'right' : 'left' }}>
              {message.role === 'user' ? (
                <Avatar sx={{ marginLeft: 'auto', marginRight: '8px' }}>ME</Avatar>
              ) : (
                <Avatar sx={{ marginRight: '8px' }}>AI</Avatar>
              )}
              <Box sx={{ maxWidth: '75%', wordWrap: 'break-word', padding: '8px', borderRadius: '20px', boxShadow: message.role === 'user' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
                <MarkdownBlock code={message.content} />
              </Box>
            </Box>
          ))}
          {loading && (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Loading response...
            </Typography>
          )}
        </Box>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex' }}>
        <TextField
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" onClick={handleSendMessage}>
                  Send
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default AiPromptGenerator;
