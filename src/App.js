// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TripProvider } from '../src/context/TripContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// Layout Components
import Layout from '../src/components/Layout/Layout';
import LoginPage from '../src/pages/auth/LoginPage';

// Main Pages
import Dashboard from '../src/pages/Dashboard';
import MyTripPage from '../src/pages/trips/MyTripPage';
import CreateTripPage from '../src/pages/trips/CreateTripPage';
import TripSuccessPage from '../src/pages/trips/TripSuccessPage';
import TravelPlansPage from '../src/pages/trips/TravelPlansPage';
import TransactionsPage from '../src/pages/transactions/TransactionsPage';
import ExchangePage from '../src/pages/exchange/ExchangePage';
import ProfilePage from '../src/pages/profile/ProfilePage';
import TripDetailPage from './pages/trips/TripDetailPage';
import TransactionDetailPage from './pages/transactions/TransactionDetailPage';
import ShareExpensePage from './pages/transactions/ShareExpensePage';
import EditTripPage from './pages/trips/EditTripPage';
import { TransactionProvider } from './context/TransactionContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF',
    },
    secondary: {
      main: '#FF3B30',
    },
    background: {
      default: '#F2F2F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
  },
});

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }
  
//   return user ? children : <Navigate to="/login" />;
// };

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="my-trip" element={<MyTripPage />} />
          <Route path="create-trip" element={<CreateTripPage />} />
          <Route path="trip-success" element={<TripSuccessPage />} />
          <Route path="travel-plans" element={<TravelPlansPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="trip/:tripId" element={<TripDetailPage/>} />
          <Route path="transaction/:transactionId" element={<TransactionDetailPage />} />
          <Route path="/transaction/:transactionId/trip/:tripId/share" element={<ShareExpensePage />} />
          <Route path="trips/edit/:tripId" element={<EditTripPage />}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TripProvider>
          <TransactionProvider>
          <NotificationProvider>
            <Router>
              <AppRoutes />
            </Router>
          </NotificationProvider>
          </TransactionProvider>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;