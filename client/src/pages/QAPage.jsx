import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/ai/question', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Q&A error:', error);
      setAnswer('Sorry, I could not process your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Q&A 🤖
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Ask questions about your team's documents and get AI-powered answers based on stored content.
      </Typography>

      <Box mb={4}>
        <TextField
          label="Ask a question about your documents..."
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAskQuestion}
          disabled={loading || !question.trim()}
          size="large"
        >
          {loading ? <CircularProgress size={20} /> : 'Ask AI'}
        </Button>
      </Box>

      {answer && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            AI Answer:
          </Typography>
          <Typography variant="body1">
            {answer}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default QAPage;
