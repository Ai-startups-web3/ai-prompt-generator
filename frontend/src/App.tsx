import { Box, Container } from '@mui/material'
import AiPromptGenerator from './components/AiSelection/AiPromptGenerator'
import NewChatButton from './components/AiSelection/NewChat'
import AISelectionForm from './components/AiSelection/AISelectionForm';
import { useState } from 'react';

function App() {
  const [selectedAI, setSelectedAI] = useState('Deepseek');

  return (
    <Container>
      <Box sx={{
        display:"flex",
        justifyContent:"space-between"
      }}>

      {/* New Chat Button */}
      <NewChatButton />
      {/* AI and Chat Selection */}
      <AISelectionForm selectedAI={selectedAI} setSelectedAI={setSelectedAI} />
      </Box>

      <AiPromptGenerator />
    </Container>
  )
}

export default App
