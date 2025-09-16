import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('text');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/documents/search?q=${query}&type=${searchType}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Documents 🔍
      </Typography>

      {/* Search Controls */}
      <Box mb={4}>
        <TextField
          label="Search query"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <ToggleButtonGroup
            value={searchType}
            exclusive
            onChange={(e, newType) => newType && setSearchType(newType)}
          >
            <ToggleButton value="text">Text Search</ToggleButton>
            <ToggleButton value="semantic">Semantic Search</ToggleButton>
          </ToggleButtonGroup>
          
          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Search'}
          </Button>
        </Box>
      </Box>

      {/* Search Results */}
      {results.length > 0 && (
        <Grid container spacing={3}>
          {results.map((doc) => (
            <Grid item xs={12} md={6} key={doc._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {doc.summary || doc.content.substring(0, 200) + '...'}
                  </Typography>
                  <Box mb={1}>
                    {doc.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                  <Typography variant="caption">
                    By: {doc.createdBy.name} • {new Date(doc.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {results.length === 0 && query && !loading && (
        <Typography variant="body1" color="text.secondary" align="center">
          No results found for "{query}"
        </Typography>
      )}
    </Container>
  );
};

export default SearchPage;
