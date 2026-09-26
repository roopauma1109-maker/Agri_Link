const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('agrilink_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Auth
  login: (credentials) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(handleResponse),

  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse),

  getMe: () => 
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Markets & Prices
  getMarkets: () => 
    fetch(`${API_BASE_URL}/markets/list`, { headers: getAuthHeaders() }).then(handleResponse),

  getCrops: () => 
    fetch(`${API_BASE_URL}/markets/crops`, { headers: getAuthHeaders() }).then(handleResponse),

  getMarketPrices: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE_URL}/markets/prices?${params}`, { headers: getAuthHeaders() }).then(handleResponse);
  },

  getPriceComparison: (crop = 'Tomato') => 
    fetch(`${API_BASE_URL}/markets/comparison?crop=${encodeURIComponent(crop)}`, { headers: getAuthHeaders() }).then(handleResponse),

  getPriceIntelligence: (crop = 'Tomato') => 
    fetch(`${API_BASE_URL}/markets/intelligence?crop=${encodeURIComponent(crop)}`, { headers: getAuthHeaders() }).then(handleResponse),

  // Crop Lots
  createCropLot: (lotData) => 
    fetch(`${API_BASE_URL}/crop-lots`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lotData)
    }).then(handleResponse),

  getCropLots: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/crop-lots?${query}`, { headers: getAuthHeaders() }).then(handleResponse);
  },

  getCropLotById: (id) => 
    fetch(`${API_BASE_URL}/crop-lots/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  closeCropLot: (id) => 
    fetch(`${API_BASE_URL}/crop-lots/${id}/close`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  deleteCropLot: (id) => 
    fetch(`${API_BASE_URL}/crop-lots/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Matching
  getBuyerMatches: (lotId) => 
    fetch(`${API_BASE_URL}/matching/lot/${lotId}`, { headers: getAuthHeaders() }).then(handleResponse),

  // Buyers
  getBuyers: () => 
    fetch(`${API_BASE_URL}/buyers/list`, { headers: getAuthHeaders() }).then(handleResponse),

  getBuyerDetails: (id) => 
    fetch(`${API_BASE_URL}/buyers/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  // Offers
  createOffer: (offerData) => 
    fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(offerData)
    }).then(handleResponse),

  getOffers: () => 
    fetch(`${API_BASE_URL}/offers`, { headers: getAuthHeaders() }).then(handleResponse),

  acceptOffer: (id) => 
    fetch(`${API_BASE_URL}/offers/${id}/accept`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  rejectOffer: (id) => 
    fetch(`${API_BASE_URL}/offers/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  counterOffer: (id, counterData) => 
    fetch(`${API_BASE_URL}/offers/${id}/counter`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(counterData)
    }).then(handleResponse),

  // Transactions
  getTransactions: () => 
    fetch(`${API_BASE_URL}/transactions`, { headers: getAuthHeaders() }).then(handleResponse),

  getTransactionDetails: (id) => 
    fetch(`${API_BASE_URL}/transactions/${id}`, { headers: getAuthHeaders() }).then(handleResponse),

  updateTransactionStage: (id, stage) => 
    fetch(`${API_BASE_URL}/transactions/${id}/stage?stage=${encodeURIComponent(stage)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Logistics
  getVehicles: () => 
    fetch(`${API_BASE_URL}/logistics/vehicles`, { headers: getAuthHeaders() }).then(handleResponse),

  estimateTransportCost: (vehicleType, distanceKm) => 
    fetch(`${API_BASE_URL}/logistics/estimate?vehicle_type=${encodeURIComponent(vehicleType)}&distance_km=${distanceKm}`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(handleResponse),

  bookTransport: (bookingData) => 
    fetch(`${API_BASE_URL}/logistics/book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    }).then(handleResponse),

  getMyBookings: () => 
    fetch(`${API_BASE_URL}/logistics/my-bookings`, { headers: getAuthHeaders() }).then(handleResponse),

  // Storage
  getStorageFacilities: () => 
    fetch(`${API_BASE_URL}/storage/list`, { headers: getAuthHeaders() }).then(handleResponse),

  requestStorage: (facilityId, quantityKg, durationDays) => 
    fetch(`${API_BASE_URL}/storage/request?facility_id=${facilityId}&quantity_kg=${quantityKg}&duration_days=${durationDays}`, {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Payments
  getPayments: () => 
    fetch(`${API_BASE_URL}/payments`, { headers: getAuthHeaders() }).then(handleResponse),

  markPaymentPaid: (id) => 
    fetch(`${API_BASE_URL}/payments/${id}/mark-paid`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Grievances
  createGrievance: (gData) => 
    fetch(`${API_BASE_URL}/grievances`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(gData)
    }).then(handleResponse),

  getGrievances: () => 
    fetch(`${API_BASE_URL}/grievances`, { headers: getAuthHeaders() }).then(handleResponse),

  updateGrievanceStatus: (id, statusVal, remarks = '') => 
    fetch(`${API_BASE_URL}/grievances/${id}/status?status_val=${encodeURIComponent(statusVal)}&remarks=${encodeURIComponent(remarks)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Notifications
  getNotifications: () => 
    fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() }).then(handleResponse),

  markNotificationsRead: () => 
    fetch(`${API_BASE_URL}/notifications/mark-read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Admin
  getAdminStats: () => 
    fetch(`${API_BASE_URL}/admin/statistics`, { headers: getAuthHeaders() }).then(handleResponse),

  getUsersList: () => 
    fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() }).then(handleResponse),

  getBuyersVerification: () => 
    fetch(`${API_BASE_URL}/admin/buyers-verification`, { headers: getAuthHeaders() }).then(handleResponse),

  verifyBuyer: (buyerId, statusVal) => 
    fetch(`${API_BASE_URL}/admin/buyers/${buyerId}/verify?status_val=${encodeURIComponent(statusVal)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    }).then(handleResponse),

  globalSearch: (query) => 
    fetch(`${API_BASE_URL}/admin/global-search?query=${encodeURIComponent(query)}`, { headers: getAuthHeaders() }).then(handleResponse)
};
