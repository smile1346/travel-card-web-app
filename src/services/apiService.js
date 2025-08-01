const API_BASE_URL = 'http://localhost:5012/api'; // Change this to match your backend

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const apiService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

 createTrip: async (tripData, token) => {
  // Prepare the payload to match the API structure
  const payload = {
    name: tripData.name,
    fromDate: tripData.fromDate,
    toDate: tripData.toDate,
    customerId: tripData.customerId || 'CUST17519656258070', // Replace with actual customerId
    cardNo: tripData.cardNo,
    owner: {
      name: tripData.owner.name
    },
    members: tripData.members.map(member => ({
      id: member.id || crypto.randomUUID(), // Generate ID if not provided
      name: member.name,
      email: member.email,
      mobileNo: member.mobileNo,
      lineId: member.lineId,
      joinedAt: new Date().toISOString(),
      isActive: true
    }))
  };

  const response = await fetch('http://localhost:5015/api/Trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
},

getTripsByCustomerId: async (customerId) => {
  const response = await fetch(`http://localhost:5015/api/Trips/customer/${customerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch trips');
  }

  return response.json();
},

  getTransactions: async (customerId, token) => {
    const response = await fetch(`${API_BASE_URL}/transactions/Spending/customer/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};


