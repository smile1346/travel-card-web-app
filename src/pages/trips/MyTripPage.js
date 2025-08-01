import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Group,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { apiService } from '../../services/apiService';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState(null);

  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const token = localStorage.getItem('travel-card-token');
        const data = await apiService.getTripsByCustomerId('CUST17515989326751', token);
        setTrips(data);
      } catch (error) {
        showNotification(error.message || 'Failed to load trips', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [user.customerId, showNotification]);

  const handleMenuOpen = (event, trip) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrip(null);
  };

  const handleDeleteClick = () => {
    setDeletingTrip(selectedTrip);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTripStatus = (fromDate, toDate) => {
    const now = new Date();
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (now < start) return { label: 'Upcoming', color: 'info' };
    if (now > end) return { label: 'Completed', color: 'success' };
    return { label: 'Active', color: 'warning' };
  };

  const getDaysDifference = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Trips
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('create-trip')}
        >
          Create Trip
        </Button>
      </Box>

      <Grid container spacing={3}>
        {trips.map((trip) => {
          const status = getTripStatus(trip.fromDate, trip.toDate);
          const duration = getDaysDifference(trip.fromDate, trip.toDate);

          return (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                      {trip.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, trip)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box mb={2}>
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(trip.fromDate)} - {formatDate(trip.toDate)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {duration} day{duration !== 1 ? 's' : ''}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <Group fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {trip.members?.length || 0} member{(trip.members?.length || 0) !== 1 ? 's' : ''}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Card: {trip.cardNo}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {trips.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No trips yet
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Create your first trip to start tracking expenses and splitting costs with friends.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('create-trip')}
          >
            Create Your First Trip
          </Button>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/trips/${selectedTrip?.id}`); handleMenuClose(); }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/trips/edit/${selectedTrip?.id}`); handleMenuClose(); }}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Trip
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Trip
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deletingTrip?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {}} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add trip"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => navigate('/trips/create')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default TripsPage;
