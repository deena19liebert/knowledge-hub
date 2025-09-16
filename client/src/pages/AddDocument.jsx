import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import DocumentForm from '../components/Documents/DocumentForm';
import api from '../services/api';

const AddDocument = () => {
  const navigate = useNavigate();

  const handleCreateDocument = async (docData) => {
    try {
      await api.post('/documents', docData);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to create document. Please try again.');
      console.error('Create document error:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Document
      </Typography>
      <DocumentForm onSubmit={handleCreateDocument} />
    </Container>
  );
};

export default AddDocument;
