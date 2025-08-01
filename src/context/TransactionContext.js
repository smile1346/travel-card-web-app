import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchInitialTransactions = async () => {
      try {
        const customerId = localStorage.getItem('travel-card-customerId');
      if (!customerId) {
        console.warn('No customer ID found in localStorage');
        return;
      }
        setTransactions(fetchTransactionsByCustomer(customerId));
      }catch (error) {
        console.error('Error fetching trips and transactions:', error);
      }
    };
    fetchInitialTransactions();
  }, []);

  const fetchTransactionsByCustomer = async (customerId) => {
  try {
    const res = await fetch(`http://localhost:5012/api/transactions/Spending/customer/${customerId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const txList = await res.json();

    if (!Array.isArray(txList) || txList.length === 0) {
      return null;
    }

    return txList.map(tx => ({
      id: tx.id,
      merchant: tx.merchantName,
      amount: tx.amount,
      currency: tx.localCurrency || tx.currency,
      date: tx.dateTime?.split('T')[0],
      time: tx.dateTime?.split('T')[1]?.slice(0, 5),
      location: tx.location,
      mcc: tx.mcc,
      payerId: tx.payerId,
      payerName: tx.payerName,
      tags: tx.tags || [],
      tripId: tx.tripId,
      description: tx.description,
      paymentMethod: tx.paymentMethod,
      status: tx.status,
      receiptUrl: tx.receiptUrl
    }));
  } catch (error) {
    console.error('Error fetching transactions by customer:', error);
    return null;
  }
};


  const getTransactionById = async (transactionId) => {
  try {
    const res = await fetch(`http://localhost:5012/api/transactions/Spending/${transactionId}`);
    const tx = await res.json();

    return {
      id: tx.id,
      merchant: tx.merchantName,
      amount: tx.amount,
      currency: tx.localCurrency || tx.currency,
      date: tx.dateTime?.split('T')[0],
      time: tx.dateTime?.split('T')[1]?.slice(0, 5),
      location: tx.location,
      mcc: tx.mcc,
      payerId: tx.payerId,
      payerName: tx.payerName,
      tags: tx.tags || []
    };
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    return null;
  }
};
  return (
  <TransactionContext.Provider
    value={{
      fetchTransactionsByCustomer,
      getTransactionById, // <-- Add this line
      transactions
    }}
  >
    {children}
  </TransactionContext.Provider>
);
};
