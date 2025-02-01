import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { TextField, Button, Typography, Box, Paper, InputAdornment } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { fetchChatResponse } from '../../lib/slices/Ai/AiApiSlice';
import { selectChatMessages, selectLoading } from '../../lib/slices/Ai/AiSlice';
import { parseMessageContent } from '../../scripts/handleAiResponse';

const AiPromptGenerator = () => {
  const [input, setInput] = useState('');
    const [selectedAI, setSelectedAI] = useState('Deepseek'); // Default selection
    const [error, setError] = useState('');
  
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const messages = useSelector(selectChatMessages);

  const handleSendMessage = () => {
    if (!input.trim()) return; 
    dispatch(fetchChatResponse({message:input}));
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Shift is NOT pressed
      e.preventDefault(); // Prevent new line in textarea
      handleSendMessage();
    }
  };

  return (
    <div style={{ margin: 'auto', padding: '20px' }}>

      <Paper
        elevation={3}
        style={{
          overflowY: 'auto',
          padding: '20px',
          marginTop: '40px',
          borderRadius: '8px',
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          style={{ 
            marginBottom: '16px', 
            textAlign: 'center', 
          }}
        >
          Chat with AI
        </Typography>
        <Box>
          {messages.map((message: { role: string; content: any; }, index: Key | null | undefined) => (
            <Box
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '8px 0',
                textAlign: message.role === 'user' ? 'right' : 'left',
              }}
            >
              {message.role === 'user' ? (
                <Avatar style={{ marginLeft: 'auto', marginRight: '8px'}}>
                  ME
                </Avatar>
              ) : (
                <Avatar style={{ marginRight: '8px'}}>
                  AI
                </Avatar>
              )}
              <Box
                style={{
                  maxWidth: '75%',
                  wordWrap: 'break-word',
                  padding: '8px',
                  borderRadius: '20px',
                  boxShadow: message.role === 'user' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                {parseMessageContent(message.content).map((part: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => 
                  typeof part === 'string' ? (
                    <span key={index}>{part}</span>
                  ) : (
                    part
                  )
                )}
              </Box>
            </Box>
          ))}
          {loading && (
            <Typography variant="body2" style={{ textAlign: 'center', marginTop: '8px' }}>
              Loading response...
            </Typography>
          )}
        </Box>
      </Paper>
      <Box style={{ marginTop: '16px', display: 'flex' }}>
        <TextField
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flexGrow: 1, marginRight: '8px'}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  style={{ 
                    height: '100%', 
                  }}
                >
                  Send
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </div>
  );
};

export default AiPromptGenerator;