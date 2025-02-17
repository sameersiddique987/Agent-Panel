import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

// Function to upload popup image
export const uploadPopupImage = async (file) => {
  const formData = new FormData();
  formData.append("popupImage", file);

  const response = await fetch(`${API_BASE}/popup/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }

  return response.json();
};

// Function to fetch the latest popup image
export const fetchPopupImage = async () => {
  const response = await fetch(`${API_BASE}/popup/get-popup`);
  return response.json();
};

// Function to create a query
export const createQuery = async (query) => {
  const response = await axios.post(`${API_BASE}/queries`, query);
  return response.data;
};

// Function to fetch all queries
export const fetchQueries = async () => {
  const response = await axios.get(`${API_BASE}/queries`);
  return response.data;
};

// Function to update a query
export const updateQuery = async (queryId, updates) => {
  const response = await axios.put(`${API_BASE}/queries/${queryId}`, updates);
  return response.data;
};

// Function to add a note to a query
export const addQueryNote = async (queryId, note) => {
  const response = await axios.post(`${API_BASE}/queries/${queryId}/note`, { note });
  return response.data;
};

// Function to create a flight
export const createFlight = async (flightData) => {
  const formData = new FormData();
  for (const key in flightData) {
    formData.append(key, flightData[key]);
  }
  const response = await axios.post(`${API_BASE}/flights/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Function to fetch all flights
export const fetchFlights = async () => {
  const response = await axios.get(`${API_BASE}/flights/all`);
  return response.data;
};