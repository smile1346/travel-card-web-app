// src/pages/profile/ProfilePage.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Edit,
  Settings,
  CreditCard,
  Notifications,
  Security,
  Help,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: <Edit />, text: 'Edit Profile', action: () => {} },
    { icon: <CreditCard />, text: 'Payment Methods', action: () => {} },
    { icon: <Notifications />, text: 'Notifications', action: () => {} },
    { icon: <Security />, text: 'Security', action: () => {} },
    { icon: <Settings />, text: 'Settings', action: () => {} },
    { icon: <Help />, text: 'Help & Support', action: () => {} },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  bgcolor: '#007AFF',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                {user?.avatar || user?.name?.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user?.name || 'User'}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {user?.email}
              </Typography>
              
              <Button variant="contained" startIcon={<Edit />} fullWidth>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Profile Settings */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box p={3} pb={1}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Account Settings
                </Typography>
              </Box>
              
              <List>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem button onClick={item.action} sx={{ px: 3, py: 2 }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                    {index < menuItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;