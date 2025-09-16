import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('handleSubmit firing...');
  setError('');
  setLoading(true);
  try {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      { email, password }
    );
    console.log('Login success:', response.data);
    // follow login success steps...
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      setError(error.response.data.message || 'Login failed');
    } else {
      console.error('Error message:', error.message);
      setError('Login failed. Check the console for details.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 
