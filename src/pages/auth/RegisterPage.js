// src/pages/auth/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    mobileNo: '',
    customerType: 1, // 1 = MBanking, 2 = NonMBanking
    // mBanking fields
    banNo: '',
    branchCode: '',
    accountType: '',
    // Non-mBanking fields
    identificationType: '',
    identificationNumber: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.email || !formData.mobileNo) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    
    const customerData = {
      customerName: formData.customerName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      customerType: parseInt(formData.customerType),
    };

    if (formData.customerType === 1) {
      customerData.mBankingProfile = {
        banNo: formData.banNo,
        branchCode: formData.branchCode,
        accountType: formData.accountType,
        accountOpenDate: new Date().toISOString(),
      };
    } else {
      customerData.nonMBankingProfile = {
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
        nationality: formData.nationality,
        address: formData.address,}}}}