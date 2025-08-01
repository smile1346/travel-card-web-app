// src/pages/trips/TripSuccessPage.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TripSuccessPage = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate('/my-trip');
  };

  const handleCreateSharedWallet = () => {
    // In a real app, this would navigate to shared wallet creation
    navigate('/my-trip');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        {/* Status Bar Simulation */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Typography variant="body2">9:41</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
            <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
            <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
          </Box>
        </Box>

        {/* Success Illustration */}
        <Box mb={4}>
          <Typography variant="h1" sx={{ fontSize: '6rem', mb: 2 }}>
            🧳✈️🏖️
          </Typography>
        </Box>

        {/* Success Message */}
        <Card sx={{ maxWidth: 500, width: '100%', mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#34C759', mb: 3 }} />
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Trip created successfully
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Do you want to gather funds from your trip mates into a shared wallet now?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleCreateSharedWallet}
                sx={{ py: 1.5 }}
              >
                Create Shared Wallet
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleDone}
                sx={{ py: 1.5 }}
              >
                Done
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default TripSuccessPage;