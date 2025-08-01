// src/pages/transactions/TransactionDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useTripContext } from '../../context/TripContext';
import { useTransactionContext } from '../../context/TransactionContext';

const TransactionDetailPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [alltransaction, setTransaction] = useState(null);
  const [shareEnabled, setShareEnabled] = useState(true);
  const { fetchTransactionsByCustomer} = useTransactionContext();
  const customerId = localStorage.getItem('travel-card-customerId');

  useEffect(() => {
  const findTransactionInTrips = async () => {
    const transactions = await fetchTransactionsByCustomer(customerId);
    setTransaction(transactions);
  };
    findTransactionInTrips();
}, [customerId, fetchTransactionsByCustomer]);


  if (!alltransaction) {
    return <Typography>Loading...</Typography>;
  }

  const transactionDetails = [
    { label: '1 USD = 33.23543', value: '' },
    { label: 'Spending foreign currency', value: '' },
    { label: 'USD Wallet', value: '' },
    { label: alltransaction.merchant.toUpperCase(), value: '' },
    { label: '2024071334975089234407819040', value: '' },
    { label: 'Bangkok Bank Mobile Banking', value: '' },
    { label: 'Spending', value: '' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="caption" color="textSecondary">
          9:41
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="caption" mr={1}>📶</Typography>
          <Typography variant="caption" mr={1}>📶</Typography>
          <Typography variant="caption">🔋</Typography>
        </Box>
      </Box>

      {/* Amount */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold">
          {Math.abs(alltransaction.amount).toLocaleString()}.00{' '}
          <Typography component="span" variant="h4" color="textSecondary">
            {alltransaction.currency}
          </Typography>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Spending amount
        </Typography>
      </Box>

      {/* Merchant Logo */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#8B5CF6',
            fontSize: '1.5rem',
          }}
        >
          {alltransaction.merchant.charAt(0)}
        </Avatar>
      </Box>

      {/* Details */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Details
        </Typography>
        <Card>
          <CardContent>
            <List disablePadding>
              {transactionDetails.map((detail, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primary={detail.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'textSecondary',
                      }}
                    />
                  </ListItem>
                  {index < transactionDetails.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Share Toggle */}
      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={shareEnabled}
                onChange={(e) => setShareEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#007AFF',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#007AFF',
                  },
                }}
              />
            }
            label="Share this expense"
            sx={{ width: '100%', justifyContent: 'space-between', ml: 0 }}
          />
        </CardContent>
      </Card>

      {/* Share Button */}
      {shareEnabled && (
        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate(`/transaction/${transactionId}/share`)}
            sx={{ borderRadius: 2, py: 1.5 }}
          >
            Share Expense
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TransactionDetailPage;