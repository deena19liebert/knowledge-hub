import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import DocumentForm from '../components/Documents/DocumentForm';
import api from '../services/api';

const EditDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/documents/${id}`);
      setDocument(response.data);
    } catch (error) {
      alert('Document not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (docData) => {
    try {
      await api.put(`/documents/${id}`, docData);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update document');
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
      <Typography variant="h4" gutterBottom>
        Edit Document
      </Typography>
      <DocumentForm
        initialTitle={document.title}
        initialContent={document.content}
        initialSummary={document.summary}
        initialTags={document.tags}
        onSubmit={handleUpdateDocument}
      />
    </Container>
  );
};

export default EditDocument;
