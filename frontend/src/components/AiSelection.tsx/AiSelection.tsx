import { Key, useState } from 'react';
import { TextField, Button, Typography, Box, Paper, InputAdornment, FormControl, InputLabel, MenuItem, Select, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchChatResponse } from '../../lib/slices/Ai/AiApiSlice';
import { selectChatMessages, selectLoading } from '../../lib/slices/Ai/AiSlice';
import { AIModel } from '../../Datatypes/enums';
import Markdown from 'react-markdown';

const AiPromptGenerator = () => {
  const [input, setInput] = useState('');
  const [selectedAI, setSelectedAI] = useState('Deepseek'); // Default selection
  const [error, setError] = useState('');

  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const messages = useSelector(selectChatMessages);

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
    dispatch(fetchChatResponse({ userMessage: input, aiType: selectedAI }));
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Shift is NOT pressed
      e.preventDefault(); // Prevent new line in textarea
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
          <Select
            labelId="ai-select-label"
            id="ai-select"
            value={selectedAI}
            onChange={(e) => setSelectedAI(e.target.value)}
          >
            <MenuItem value={AIModel.Deepseek}>{AIModel.Deepseek}</MenuItem>
            <MenuItem value={AIModel.ChatGPT}>{AIModel.ChatGPT}</MenuItem>
            <MenuItem value={AIModel.Gemini}>{AIModel.Gemini}</MenuItem>
          </Select>
        </FormControl>

        {/* Display error message if any */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box>
          {messages.map((message: { role: string; content: any; }, index: Key | null | undefined) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', margin: '8px 0', textAlign: message.role === 'user' ? 'right' : 'left' }}>
              {message?.role === 'user' ? (
                <Avatar sx={{ marginLeft: 'auto', marginRight: '8px' }}>ME</Avatar>
              ) : (
                <Avatar sx={{ marginRight: '8px' }}>AI</Avatar>
              )}
              <Box sx={{ maxWidth: '75%', wordWrap: 'break-word', padding: '8px', borderRadius: '20px', boxShadow: message.role === 'user' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
                <Markdown>
                  {message.content}
                </Markdown>
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
