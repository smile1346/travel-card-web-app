// src/pages/exchange/ExchangePage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  SwapVert,
  TrendingUp,
} from '@mui/icons-material';
import { useTripContext } from '../../context/TripContext';

const ExchangePage = () => {
  const { currencies } = useTripContext();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('THB');
  const [amount, setAmount] = useState('1000');

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);
  
  const exchangeRate = toCurrencyData ? toCurrencyData.rate / (fromCurrencyData?.rate || 1) : 1;
  const convertedAmount = parseFloat(amount) * exchangeRate;

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Currency Exchange
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Exchange Calculator */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
                Exchange Calculator
              </Typography>

              {/* From Currency */}
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  From
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#F2F2F7' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {fromCurrencyData?.flag}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {fromCurrency}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          sx: { fontSize: '1.2rem', fontWeight: 600, textAlign: 'right' }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Swap Button */}
              <Box display="flex" justifyContent="center" mb={3}>
                <IconButton
                  onClick={handleSwapCurrencies}
                  sx={{
                    bgcolor: '#F2F2F7',
                    '&:hover': { bgcolor: '#E5E5EA' }
                  }}
                >
                  <SwapVert />
                </IconButton>
              </Box>

              {/* To Currency */}
              <Box mb={4}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  To
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#F2F2F7' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {toCurrencyData?.flag}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {toCurrency}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, textAlign: 'right' }}
                      >
                        {convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Exchange Rate Info */}
              <Box textAlign="center" mb={4}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Exchange Rate
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </Typography>
                <Typography variant="body2" sx={{ color: '#34C759', fontWeight: 600 }}>
                  Save now 1,216 THB
                </Typography>
              </Box>

              {/* Exchange Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 2, fontSize: '1.1rem' }}
              >
                Exchange Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Popular Currencies */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Popular Currencies
              </Typography>
              
              {currencies.slice(0, 6).map((currency) => (
                <Paper
                  key={currency.code}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#F8F9FA' },
                    '&:last-child': { mb: 0 }
                  }}
                  onClick={() => setFromCurrency(currency.code)}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {currency.flag}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currency.code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currency.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                        {currency.rate.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Market Trends
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ color: '#34C759', mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  USD/THB trending up
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The Thai Baht has weakened against the US Dollar by 0.8% this week, making it a good time to exchange.
              </Typography>
              
              <Button variant="outlined" size="small" fullWidth>
                View All Trends
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExchangePage;