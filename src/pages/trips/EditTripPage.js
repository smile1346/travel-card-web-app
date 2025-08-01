// src/pages/trips/EditTripPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Grid, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { apiService } from '../../services/apiService';

const EditTripPage = () => {
  const [tripData, setTripData] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', mobileNo: '', lineId: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('travel-card-token');
        const data = await apiService.getTripById(tripId, token);
        setTripData(data);
      } catch (error) {
        showNotification('Failed to load trip data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId, showNotification]);

  const handleTripDataChange = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleOwnerChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      owner: { ...prev.owner, [field]: value },
    }));
  };

  const handleNewMemberChange = (field, value) => {
    setNewMember(prev => ({ ...prev, [field]: value }));
  };

  const addMember = () => {
    if (!newMember.name || !newMember.email) {
      showNotification('Please fill in member name and email', 'error');
      return;
    }
    if (tripData.members.some(member => member.email === newMember.email)) {
      showNotification('Member with this email already exists', 'error');
      return;
    }
    setTripData(prev => ({
      ...prev,
      members: [...prev.members, { ...newMember }],
    }));
    setNewMember({ name: '', email: '', mobileNo: '', lineId: '' });
  };

  const removeMember = (index) => {
    setTripData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTrip = async () => {
    if (!tripData.name || !tripData.owner.name) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('travel-card-token');
      const payload = {
        ...tripData,
        customerId: user.customerId,
      };
      await apiService.updateTrip(tripId, payload, token);
      showNotification('Trip updated successfully!', 'success');
      navigate('/trips');
    } catch (error) {
      showNotification(error.message || 'Failed to update trip', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !tripData) return <CircularProgress />;

  return (
    <Box p={3}>
      <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
      <Typography variant="h4" gutterBottom>Edit Trip</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Trip Name"
              fullWidth
              value={tripData.name}
              onChange={(e) => handleTripDataChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={tripData.fromDate}
                onChange={(date) => handleTripDataChange('fromDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={tripData.toDate}
                onChange={(date) => handleTripDataChange('toDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Card Number"
              fullWidth
              value={tripData.cardNo}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Owner Name"
              fullWidth
              value={tripData.owner.name}
              onChange={(e) => handleOwnerChange('name', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Trip Members</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Name"
              fullWidth
              value={newMember.name}
              onChange={(e) => handleNewMemberChange('name', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Email"
              fullWidth
              value={newMember.email}
              onChange={(e) => handleNewMemberChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Mobile No"
              fullWidth
              value={newMember.mobileNo}
              onChange={(e) => handleNewMemberChange('mobileNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Line ID"
              fullWidth
              value={newMember.lineId}
              onChange={(e) => handleNewMemberChange('lineId', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" startIcon={<Add />} onClick={addMember}>Add Member</Button>
          </Grid>
        </Grid>

        <List>
          {tripData.members.map((member, index) => (
            <ListItem key={index}>
              <ListItemText primary={member.name} secondary={member.email} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => removeMember(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateTrip}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'Update Trip'}
        </Button>
      </Paper>
    </Box>
  );
};

export default EditTripPage;