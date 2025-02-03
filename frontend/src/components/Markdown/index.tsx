import ReactMarkdown from 'react-markdown';
import { FC, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

interface Props {
  code: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export const MarkdownBlock: FC<Props> = ({
  code,
  editable = false,
  onChange = () => {},
}) => {
  const [copyText, setCopyText] = useState<string>('Copy');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyText('Copy');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copyText]);

  return (
    <Box position="relative">
      <Button
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 10,
          bgcolor: 'red',
          color: 'white',
          fontSize: '0.75rem',
          padding: '4px',
          '&:hover': { bgcolor: '#2D2E3A' },
          '&:active': { bgcolor: '#2D2E3A' },
          borderRadius: '4px',
        }}
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopyText('Copied!');
        }}
      >
        {copyText}
      </Button>

      <Box
        sx={{
          p: 2,
          maxHeight: '500px',
          bgcolor: '#1A1B26',
          color: 'white',
          overflow: 'auto',
          borderRadius: '8px',
        }}
      >
        <ReactMarkdown>{code}</ReactMarkdown>
      </Box>
    </Box>
  );
};
