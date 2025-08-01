
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, Card, CardContent, Avatar, Chip,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripContext } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { useTransactionContext } from '../../context/TransactionContext';

const ShareExpensePage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip } = useTripContext();
  const { showNotification } = useNotification();

  const [transaction, setTransaction] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [splitType, setSplitType] = useState('equally');
  const [customAmounts, setCustomAmounts] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { tripId } = useParams();
  const { getTransactionById } = useTransactionContext();
  const { getTripById } = useTripContext();

useEffect(() => {
  const fetchData = async () => {
    try {
      const tx = await getTransactionById(transactionId);
      if (!tx) {
        showNotification('Transaction not found', 'error');
        return;
      }

      const trip = await getTripById(tripId);
      if (!trip) {
        showNotification('Trip not found', 'error');
        navigate('/trips');
        return;
      }

      setTransaction(tx);
      setCurrentTrip(trip);

      const initialSelected = {};
      const initialAmounts = {};
      const splitAmount = Math.abs(tx.amount) / trip.members.length;

      trip.members.forEach(member => {
        initialSelected[member.id] = true;
        initialAmounts[member.id] = splitAmount;
      });

      // Fetch split data from splitTransaction service
      const res = await fetch(`http://localhost:5013/api/splits/transaction/${transactionId}`);
      if (res.ok) {
        const splitData = await res.json();

        splitData.participants.forEach(p => {
          initialSelected[p.memberId] = true;
          initialAmounts[p.memberId] = p.shareAmount;
        });

        setSplitType(splitData.splitType === 1 ? 'equally' : 'custom');
      }

      setSelectedMembers(initialSelected);
      setCustomAmounts(initialAmounts);
    } catch (error) {
      console.error('Error loading transaction or split data:', error);
      showNotification('Failed to load transaction', 'error');
    }
  };

  fetchData();
}, [transactionId, tripId, getTransactionById, getTripById, navigate, showNotification]);

const toggleMemberSelection = (memberId) => {
  setSelectedMembers(prev => {
    const updated = {
      ...prev,
      [memberId]: !prev[memberId]
    };

    if (!currentTrip.members || currentTrip.members.length === 0) return;
    // Recalculate after updating selection
    if (splitType === 'equally') {
      const selectedCount = Object.values(updated).filter(Boolean).length;
      const splitAmount = selectedCount > 0 ? Math.abs(transaction.amount) / selectedCount : 0;

      const newAmounts = {};
      currentTrip.members.forEach(member => {
        newAmounts[member.id] = updated[member.id] ? splitAmount : 0;
      });

      setCustomAmounts(newAmounts);
    }

    return updated;
  });
};

  const recalculateEqualSplit = () => {
    const selectedCount = Object.values(selectedMembers).filter(Boolean).length;
    const splitAmount = selectedCount > 0 ? Math.abs(transaction.amount) / selectedCount : 0;

    const newAmounts = {};
    currentTrip.members.forEach(member => {
      newAmounts[member.id] = selectedMembers[member.id] ? splitAmount : 0;
    });

    setCustomAmounts(newAmounts);
  };

  const handleSplitTypeChange = (type) => {
    setSplitType(type);
    if (type === 'equally') {
      recalculateEqualSplit();
    }
  };

  const handleCustomAmountChange = (memberId, amount) => {
    setCustomAmounts(prev => ({
      ...prev,
      [memberId]: parseFloat(amount) || 0
    }));
  };

 const handleSaveShare = async () => {
  const participants = currentTrip.members
    .filter(member => selectedMembers[member.id])
    .map(member => ({
      memberId: member.id,
      memberName: member.name,
      shareAmount: customAmounts[member.id] || 0,
      sharePercentage: 0,
      shares: 0
    }));

  const sharePayload = {
    transactionId,
    tripId,
    totalAmount: Math.abs(transaction.amount),
    splitType: splitType === 'equally' ? 1 : 2,
    currency: transaction.currency || 'USD',
    payerId: transaction.payerId || '',
    payerName: transaction.payerName || '',
    participants,
    tagNames: transaction.tags || []
  };

  try {
  // Step 1: Check if split exists for this transaction
  const checkRes = await fetch(`http://localhost:5013/api/splits/transaction/${transactionId}`);

  console.log('Check split response status:', checkRes.status);

  let method = 'POST';
  let endpoint = `http://localhost:5013/api/splits`;

  if (checkRes.ok) {
    const existingSplit = await checkRes.json();
    method = 'PUT';
    endpoint = `http://localhost:5013/api/splits/${existingSplit.id}`; // Use splitId here
  }

  // Step 2: Save or update the split
  const response = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sharePayload)
  });

  if (!response.ok) throw new Error('Failed to save shared expense');

  showNotification('Expense shared successfully!', 'success');
  navigate(-1);
} catch (error) {
  console.error(error);
  showNotification('Failed to share expense', 'error');
}};

  const totalShared = Object.values(customAmounts).reduce((sum, amount) => sum + amount, 0);
  const remainingAmount = Math.abs(transaction?.amount || 0) - totalShared;

  if (!currentTrip || !transaction) return <Typography>Loading...</Typography>;
  if (!currentTrip.members || currentTrip.members.length === 0) {
  return (
    <Typography color="textSecondary" mb={2}>
      This trip has no members to share expenses with.
    </Typography>
  );
}

  

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h6" fontWeight="bold">Share this expense to</Typography>
        <IconButton onClick={() => navigate(-1)}><Close /></IconButton>
      </Box>

      <Card sx={{ mb: 3, background: 'linear-gradient(135deg,rgb(5, 96, 201) 0%,rgb(120, 214, 255) 100%)' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="bold" color="white">{currentTrip.name}</Typography>
              <Box display="flex" mt={1}>
                <Typography variant="body2" color="white" mr={3}>
                  {currentTrip.balance.amount.toLocaleString()}.00 {currentTrip.balance.currency}
                </Typography>
                <Typography variant="body2" color="white">
                  {(currentTrip.balance.amount * 1.2).toLocaleString()}.00 {currentTrip.balance.currency}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              🏙️
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box mb={3}>
        <Typography variant="body2" color="textSecondary" mb={1}>Amount to share</Typography>
        <Typography variant="h4" fontWeight="bold">
          {Math.abs(transaction.amount).toLocaleString()}.00{' '}
          <Typography component="span" variant="h5" color="textSecondary">{currentTrip.balance.currency}</Typography>
        </Typography>
        {remainingAmount !== 0 && (
          <Typography variant="body2" color="error" mt={1}>
            Remaining: {remainingAmount.toFixed(2)} USD
          </Typography>
        )}
      </Box>

      <Box mb={3}>
        <Typography variant="body2" color="textSecondary" mb={2}>Split type</Typography>
        <Box display="flex" gap={1}>
          {['equally', 'number', 'percentage'].map(type => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={() => handleSplitTypeChange(type)}
              variant={splitType === type ? 'filled' : 'outlined'}
              color={splitType === type ? 'primary' : 'default'}
              sx={{ borderRadius: 6 }}
            />
          ))}
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="body2" color="textSecondary" mb={2}>Select members</Typography>
        <List disablePadding>
          {currentTrip.members.map(member => (
            <ListItem key={member.id} sx={{
              bgcolor: 'white', borderRadius: 2, mb: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: '#007AFF' }}>{member.avatar}</Avatar>
              </ListItemIcon>
              <ListItemText primary={member.name} primaryTypographyProps={{ fontWeight: 'medium' }} />
              <ListItemSecondaryAction>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" mr={2}>
                    {customAmounts[member.id]?.toFixed(2) || '0.00'}
                  </Typography>
                  <Checkbox
                    checked={selectedMembers[member.id] || false}
                    onChange={() => toggleMemberSelection(member.id)}
                    sx={{ '&.Mui-checked': { color: '#10B981' } }}
                  />
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      {splitType !== 'equally' && (
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => setEditDialogOpen(true)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Edit Amounts
        </Button>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSaveShare}
        disabled={remainingAmount !== 0 || !currentTrip.members?.length}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        Save
      </Button>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Member Amounts</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {currentTrip.members.map(member => (
              <Grid item xs={12} key={member.id}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: '#007AFF' }}>{member.avatar}</Avatar>
                  <TextField
                    label={member.name}
                    type="number"
                    value={customAmounts[member.id] || 0}
                    onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Total: {totalShared.toFixed(2)} USD
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Remaining: {remainingAmount.toFixed(2)} USD
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setEditDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShareExpensePage;