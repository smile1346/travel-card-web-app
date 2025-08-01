// src/pages/trips/TravelPlansPage.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Container,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../../context/TripContext';

const TravelPlansPage = () => {
  const navigate = useNavigate();
  const { currencies, destinations } = useTripContext();

  return (
    <Container maxWidth="lg">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Travel Plans
          </Typography>
          <IconButton onClick={() => navigate('/my-trip')}>
            <Close />
          </IconButton>
        </Box>

        {/* Main Question */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, lineHeight: 1.2 }}>
            Do you have any plans to travel?
          </Typography>
        </Box>

        {/* Currency Flags */}
        <Box display="flex" justifyContent="center" mb={6}>
          <Grid container spacing={3} sx={{ maxWidth: 600 }}>
            {currencies.slice(0, 7).map((currency) => (
              <Grid item key={currency.code}>
                <Box textAlign="center">
                  <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>
                    {currency.flag}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {currency.code}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Best Attractions */}
        <Box mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Best attraction 2025
            </Typography>
            <Button size="small" color="primary">
              View all
            </Button>
          </Box>

          <Grid container spacing={3}>
            {destinations.map((destination) => (
              <Grid item xs={12} md={6} key={destination.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 100,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          {destination.image}
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {destination.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {destination.description}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Budget {destination.budget}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#34C759', fontWeight: 600 }}>
                          Exchange today save now {destination.savings}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Create Your Own Trip */}
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/create-trip')}
            sx={{ py: 2, px: 4, fontSize: '1.1rem' }}
          >
            Create your own trip
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TravelPlansPage;