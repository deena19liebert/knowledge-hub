import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Typography
} from '@mui/material';
import api from '../../services/api';

const DocumentForm = ({
  initialTitle = '',
  initialContent = '',
  initialSummary = '',
  initialTags = [],
  onSubmit
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [summary, setSummary] = useState(initialSummary);
  const [tags, setTags] = useState(initialTags);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState('');
/*
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setSummary(initialSummary);
    setTags(initialTags);
  }, [initialTitle, initialContent, initialSummary, initialTags]);
*/
  const handleSummarize = async () => {
    setLoadingSummary(true);
    setError('');
    try {
      const response = await api.post('/ai/summarize', { content });
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    setLoadingTags(true);
    setError('');
    try {
      const response = await api.post('/ai/generate-tags', { content });
      setTags(response.data.tags);
    } catch (err) {
      setError('Failed to generate tags.');
    } finally {
      setLoadingTags(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    // Pass all fields to parent or API create call
    onSubmit({ title, content, summary, tags });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Content"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        minRows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSummarize}
          disabled={loadingSummary}
        >
          {loadingSummary ? <CircularProgress size={20} /> : 'Summarize with Gemini'}
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerateTags}
          disabled={loadingTags}
        >
          {loadingTags ? <CircularProgress size={20} /> : 'Generate Tags with Gemini'}
        </Button>
      </Box>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Summary"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        minRows={3}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Box sx={{ mb: 2 }}>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
        ))}
      </Box>
      <Button variant="contained" type="submit" fullWidth>
        Save Document
      </Button>
    </Box>
  );
};

export default DocumentForm;
