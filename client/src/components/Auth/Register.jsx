import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        { name, email, password }
      );
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
