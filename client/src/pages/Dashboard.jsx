import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/documents/${docId}`);
        setDocuments(documents.filter(doc => doc._id !== docId));
      } catch (error) {
        alert('Failed to delete document');
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Welcome, {user?.name}! 📚 Knowledge Hub
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => navigate('/add-document')}
            sx={{ mr: 2 }}
          >
            Add Document
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/search')}
            sx={{ mr: 2 }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/qa')}
            sx={{ mr: 2 }}
          >
            Ask AI
          </Button>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Document Grid */}
      {documents.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No documents yet. Create your first document!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} md={6} lg={4} key={doc._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {doc.summary || doc.content.substring(0, 150) + '...'}
                  </Typography>
                  <Box mb={2}>
                    {doc.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                  <Typography variant="caption" display="block">
                    By: {doc.createdBy.name} • {new Date(doc.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/edit-document/${doc._id}`)}>
                    Edit
                  </Button>
                  {(user?.role === 'admin' || doc.createdBy._id === user?.id) && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteDocument(doc._id)}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
