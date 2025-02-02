import { Box, Container, Typography } from '@mui/material'
import AISelectionForm from './components/AiSelection.tsx/AiSelection'

function App() {

  return (
    <Container>
      <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prompt Creator Website
        </Typography>
      </Box>
      <AISelectionForm />
    </Container>
  )
}

export default App
