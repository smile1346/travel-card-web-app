// src/pages/Dashboard.js
import React from 'react';
import { apiService} from '../services/apiService';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import {
  Flight,
  Payment,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', color: 'white' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="inherit" gutterBottom variant="h6" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography sx={{ opacity: 0.8 }} variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, currencies } = useTripContext();
  
  const currentTrip = trips[0];
  const totalSpending = currentTrip?.transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
  const currencyCount = currentTrip?.transactions ? new Set(currentTrip.transactions.map(tx => tx.currency)).size : 0;


  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Welcome back, {currentTrip?.owner.name || 'User'}! 👋
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Trips"
            value={trips.length}
            icon={<Flight fontSize="large" />}
            subtitle="Currently managing"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Balance"
            value={`$${currentTrip?.transactions.amount?.toLocaleString() || 0}`}
            icon={<AccountBalance fontSize="large" />}
            subtitle="Available funds"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Spending"
            value={`$${totalSpending.toLocaleString()}`}
            icon={<Payment fontSize="large" />}
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Countries"
            value={currencyCount}
            icon={<TrendingUp fontSize="large" />}
            subtitle="Destinations visited"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Flight />}
                  onClick={() => navigate('/my-trip')}
                  sx={{ py: 2 }}
                >
                  View My Trip
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Payment />}
                  onClick={() => navigate('/transactions')}
                  sx={{ py: 2 }}
                >
                  View Transactions
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/create-trip')}
                  sx={{ py: 2 }}
                >
                  Create New Trip
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/exchange')}
                  sx={{ py: 2 }}
                >
                  Currency Exchange
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/transaction/60D2C08D-3F84-4188-9916-BDB35DFC060C/share')}
                  sx={{ py: 2 }}
                >
                  Share Expense Page
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Exchange Rates
            </Typography>
            <Box>
              {currencies.slice(0, 4).map((currency) => (
                <Box key={currency.code} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>{currency.flag}</Typography>
                    <Typography variant="body2">{currency.code}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {currency.rate.toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Button size="small" onClick={() => navigate('/exchange')}/>
            </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
  )};

  export default Dashboard;