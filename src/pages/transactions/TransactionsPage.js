import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  Payment,
  Add,
  FilterList,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTransactionContext } from '../../context/TransactionContext';
import { useNotification } from '../../context/NotificationContext';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { fetchTransactionsByCustomer, transactions } = useTransactionContext();
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days');
  const [alltransaction, setTransaction] = useState(null);
  const customerId = localStorage.getItem('travel-card-customerId');
  const periods = ['7 Days', '14 Days', '30 Days', 'Custom'];

  useEffect(() => {
  const findTransactionInTrips = async () => {
    if (!customerId) {
      showNotification('Customer ID not found', 'error');
      navigate('/trips');
      return;
    }

    const transactions = await fetchTransactionsByCustomer(customerId);

    if (transactions && transactions.length > 0) {
      setTransaction(transactions);
    } else {
      showNotification('No transactions found for this customer', 'error');
      navigate('/trips');
    }
  };

  findTransactionInTrips();
}, [customerId, fetchTransactionsByCustomer, showNotification, navigate]);

  

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount));
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/add-transaction')}
        >
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {/* Period Selector */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Transaction Period
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {periods.map((period) => (
                  <Chip
                    key={period}
                    label={period}
                    onClick={() => setSelectedPeriod(period)}
                    color={selectedPeriod === period ? 'primary' : 'default'}
                    variant={selectedPeriod === period ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary">
                1 July - 7 July 2025
              </Typography>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box p={3} pb={1}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Transactions
                </Typography>
              </Box>
              <List>
                {alltransaction?.length === 0 ? (
                  <Typography variant="body2" sx={{ px: 3, py: 2 }}>
                    No transactions found.
                  </Typography>
                ) : (
                  alltransaction?.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: '#F2F2F7', color: '#007AFF' }}>
                            <Payment />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {transaction.merchant}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {transaction.date} {transaction.time}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {transaction.location}
                              </Typography>
                            </Box>
                          }
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: transaction.amount > 0 ? '#34C759' : '#000',
                          }}
                        >
                          {/* {transaction.amount > 0 ? '+' : ''} */}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Typography>
                      </ListItem>
                      {index < alltransaction.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          {/* Summary and Quick Actions */}
          {/* You can enhance this section with dynamic data if needed */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionsPage;
