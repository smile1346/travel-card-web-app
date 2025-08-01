// src/pages/trips/TripDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Button,
    Chip,
    Grid,
    Paper,
    Divider,
    useTheme,
} from '@mui/material';
import {
    ArrowBack,
    Add,
    Edit,
    MoreVert,
    Group,
    AccountBalance,
    Receipt,
    Share,
    South,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useTripContext } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';

const TripDetailPage = () => {
    
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [currentTrip, setCurrentTrip] = useState(null);
  const { getTripById } = useTripContext();

  useEffect(() => {
     const fetchTrip = async () => {
     const trip = await getTripById(tripId);
     if (trip) {
         setCurrentTrip(trip);
     } else {
        showNotification('Trip not found', 'error');
         navigate('/trips');
     }
    };

    fetchTrip();
  }, [tripId, getTripById, navigate, showNotification]);

  if (!currentTrip) {
    return <Typography>Loading trip details...</Typography>;
  }


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    
const expenseData = currentTrip.transactions.map(tx => ({
  name: tx.merchant || 'Unknown',
  value: Math.abs(tx.amount),
  color: '#' + Math.floor(Math.random() * 16777215).toString(16)
}));


    const totalSpent = currentTrip.transactions.reduce((sum, item) => sum + item.amount, 0);
    console.log(currentTrip);
    

    const ExpenseChart = () => (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                    {totalSpent.toLocaleString()} {currentTrip.balance.currency}
                </Typography>
                <IconButton size="small">
                    <Edit />
                </IconButton>
            </Box>

            <Box display="flex" justifyContent="center" mb={3}>
  <ResponsiveContainer width={200} height={200}>
    <PieChart>
      <Pie
        data={expenseData}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {expenseData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
</Box>


            <Box display="flex" justifyContent="center" mb={3}>
                {currentTrip.members.map((member, index) => (
                    <Avatar
                        key={member.id}
                        sx={{
                            width: 32,
                            height: 32,
                            ml: index > 0 ? -1 : 0,
                            border: '2px solid white',
                            bgcolor: theme.palette.primary.main,
                        }}
                    >
                        {member.avatar}
                    </Avatar>
                ))}
            </Box>
        </Paper>
    );

    const TransactionList = () => (
        <List>
            {currentTrip.transactions.map((transaction) => (
                <ListItem
                    key={transaction.id}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        mb: 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    secondaryAction={
                        <Box display="flex" alignItems="center">
                            <Box textAlign="right" mr={1}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color={transaction.amount < 0 ? 'error' : 'success'}
                                >
                                    {transaction.amount < 0 ? '-' : '+'}{Math.abs(transaction.amount).toLocaleString()} {transaction.currency}
                                </Typography>
                                {transaction.amount > 0 && transaction.splits?.length > 0 && (
                                <Box display="flex" mt={0.5}>
                                    {transaction.splits.slice(0, 3).map((split) => (
                                    <Avatar
                                        key={split.memberId}
                                        sx={{
                                        width: 16,
                                        height: 16,
                                        fontSize: '0.6rem',
                                        ml: 0.25,
                                        }}
                                    >
                                        {split.avatar || split.initials}
                                    </Avatar>
                            ))}
                        </Box>
                                )}

                            </Box>
                            <IconButton
                                size="small"
                                onClick={() => navigate(`/transaction/${transaction.id}/trip/${currentTrip.id}/share`)}
                            >
                                <Share />
                            </IconButton>
                        </Box>
                    }
                >
                    <ListItemIcon>
                        <Avatar
                            sx={{
                                bgcolor: transaction.type === 'expense' ? '#8B5CF6' : '#10B981',
                                width: 40,
                                height: 40,
                            }}
                        >
                            {transaction.merchant.charAt(0)}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={transaction.merchant}
                        secondary={`${transaction.date} ${transaction.time}`}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate('/my-trip')} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1 }}>
                    {currentTrip.name}
                </Typography>
                <IconButton>
                    <Add />
                </IconButton>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Expense" />
                    <Tab label="Budget" />
                </Tabs>
            </Box>

            {/* Content */}
            {tabValue === 0 && (
                <Box>
                    <ExpenseChart />

                    <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
                        <Typography variant="h6" fontWeight="bold">
                            View by
                        </Typography>
                        <Button variant="text" color="primary" size="small">
                            Recent transactions
                        </Button>
                    </Box>

                    <TransactionList />
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Budget Overview
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box textAlign="center">
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {currentTrip.balance.amount.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            USD Available
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box textAlign="center">
                                        <Typography variant="h4" color="error" fontWeight="bold">
                                            {totalSpent.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            USD Spent
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
};

export default TripDetailPage;