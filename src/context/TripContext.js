import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTripsAndTransactions = async () => {
      try {
        const customerId = localStorage.getItem('travel-card-customerId');
        if (!customerId) {
          console.warn('No customer ID found in localStorage');
          return;
        }

        const tripRes = await fetch(`http://localhost:5015/api/Trips/customer/${customerId}`);
        const tripData = await tripRes.json();

        const tripList = Array.isArray(tripData) ? tripData : [tripData];

        const enrichedTrips = await Promise.all(
          tripList.map(async (trip) => {
            const txRes = await fetch(`http://localhost:5012/api/transactions/Spending/trip/${trip.id}`);
            const txData = await txRes.json();

            const mappedTransactions = txData.map(tx => ({
              id: tx.id,
              merchant: tx.merchantName,
              amount: tx.amount,
              currency: tx.localCurrency || tx.currency,
              date: tx.dateTime?.split('T')[0],
              time: tx.dateTime?.split('T')[1]?.slice(0, 5),
              type: 'expense',
              location: tx.location,
              mcc: tx.mcc
            }));

            
          // Calculate total amount and currency
          const totalAmount = mappedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
          const currency = mappedTransactions[0]?.currency;


            return {
              id: trip.id,
              name: trip.name,
              destinations: [],
              balance: { amount: totalAmount, currency: currency, thbEquivalent: 0 },
              fromDate: trip.fromDate?.split('T')[0],
              toDate: trip.toDate?.split('T')[0],
              status: 'active',
              transactions: mappedTransactions,
              owner: trip.owner,
              members: trip.members,
              budgets: {}
            };
          })
        );

        setTrips(enrichedTrips);
      } catch (error) {
        console.error('Error fetching trips and transactions:', error);
      }
    };

    fetchTripsAndTransactions();
  }, []);

  const getTripById = async (tripId) => {
    try {
      const tripRes = await fetch(`http://localhost:5015/api/Trips/${tripId}`);
      const trip = await tripRes.json();

      const txRes = await fetch(`http://localhost:5012/api/transactions/Spending/trip/${trip.id}`);
      const txData = await txRes.json();

      const mappedTransactions = txData.map(tx => ({
        id: tx.id,
        merchant: tx.merchantName,
        amount: tx.amount,
        currency: tx.localCurrency || tx.currency,
        date: tx.dateTime?.split('T')[0],
        time: tx.dateTime?.split('T')[1]?.slice(0, 5),
        type: 'expense',
        location: tx.location,
        mcc: tx.mcc
      }));

      // Calculate total amount and currency
          const totalAmount = mappedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
          const currency = mappedTransactions[0]?.currency;

      return {
        id: trip.id,
        name: trip.name,
        destinations: [],
        balance: { amount: totalAmount, currency: currency, thbEquivalent: 0 },
        fromDate: trip.fromDate?.split('T')[0],
        toDate: trip.toDate?.split('T')[0],
        status: 'active',
        transactions: mappedTransactions,
        owner: trip.owner,
        members: trip.members,
        budgets: {}
      };
    } catch (error) {
      console.error('Error fetching trip by ID:', error);
      return null;
    }
  };

  const [currencies] = useState([
    { code: 'USD', flag: '🇺🇸', rate: 1.0, name: 'US Dollar' },
    { code: 'JPY', flag: '🇯🇵', rate: 110.0, name: 'Japanese Yen' },
    { code: 'CNY', flag: '🇨🇳', rate: 6.45, name: 'Chinese Yuan' },
    { code: 'AUD', flag: '🇦🇺', rate: 1.35, name: 'Australian Dollar' },
    { code: 'GBP', flag: '🇬🇧', rate: 0.73, name: 'British Pound' },
    { code: 'HKD', flag: '🇭🇰', rate: 7.8, name: 'Hong Kong Dollar' },
    { code: 'CAD', flag: '🇨🇦', rate: 1.25, name: 'Canadian Dollar' },
    { code: 'THB', flag: '🇹🇭', rate: 32.68, name: 'Thai Baht' }
  ]);

  const [destinations] = useState([
    {
      id: '1',
      name: 'Highlights of Las Vegas',
      budget: '50,000฿',
      savings: '1,216 THB',
      image: '🎰🏙️',
      popular: true,
      description: 'Experience the glitz and glamour of Las Vegas'
    },
    {
      id: '2',
      name: 'Ultimate Hover Dam',
      budget: '45,000฿',
      savings: '1,100 THB',
      image: '🏞️⚡',
      popular: false,
      description: 'Marvel at this engineering wonder'
    }
  ]);

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      balance: { amount: 0, currency: 'USD', thbEquivalent: 0 },
      transactions: [],
      status: 'upcoming'
    };
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    setTrips(prev => prev.map(trip =>
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
  };

  const addTransaction = (tripId, transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5)
    };

    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const updatedTransactions = [...trip.transactions, newTransaction];
        const newBalance = trip.balance.amount + transaction.amount;
        return {
          ...trip,
          transactions: updatedTransactions,
          balance: {
            ...trip.balance,
            amount: newBalance,
            thbEquivalent: newBalance * 32.68
          }
        };
      }
      return trip;
    }));
  };

  const value = {
    trips,
    currencies,
    destinations,
    addTrip,
    updateTrip,
    addTransaction,
    setTrips,
    getTripById
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};