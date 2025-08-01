// src/pages/auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    customerId: 'CUST17515989326751',
    password: 'password123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!credentials.customerId || !credentials.password) {
    setError('Please fill in all fields');
    return;
  }

  setLoading(true);
  const result = await login(credentials);
  setLoading(false);

  if (result.success) {
    // ✅ Save customerId to localStorage
    localStorage.setItem('travel-card-customerId', credentials.customerId);

    showNotification('Login successful!', 'success');
    navigate('/');
  } else {
    setError(result.error);
  }
};

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F2F2F7',
          paddingTop: 8,
        }}
      >
        <Paper elevation={0} sx={{ padding: 4, width: '100%', borderRadius: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" sx={{ fontSize: '2.5rem', mb: 1 }}>
              ✈️
            </Typography>
            <Typography component="h1" variant="h4" gutterBottom>
              Travel Card
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Please sign in to continue.
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="customerId"
              label="Customer Id"
              name="customerId"
              autoComplete="customerId"
              autoFocus
              value={credentials.customerId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: '#007AFF',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Demo credentials are pre-filled. Click "Sign In" to continue.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;