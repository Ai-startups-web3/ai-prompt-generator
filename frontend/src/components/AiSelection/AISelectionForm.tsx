import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AIModel } from '../../Datatypes/enums';

const AISelectionForm = ({ selectedAI, setSelectedAI }: any) => {

  return (
    <Box >
      {/* AI Selection Dropdown */}
      <FormControl sx={{ mt: 2 }}>
        <InputLabel id="ai-select-label">Select AI</InputLabel>
        <Select labelId="ai-select-label" id="ai-select" value={selectedAI} onChange={(e) => setSelectedAI(e.target.value)}>
          <MenuItem value={AIModel.Deepseek}>{AIModel.Deepseek}</MenuItem>
          <MenuItem value={AIModel.ChatGPT}>{AIModel.ChatGPT}</MenuItem>
          <MenuItem value={AIModel.Gemini}>{AIModel.Gemini}</MenuItem>
        </Select>
      </FormControl>

    </Box>
  );
};

export default AISelectionForm;
