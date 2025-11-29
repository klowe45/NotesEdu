import { API_URL as BASE_API_URL } from '../config/api';

const API_URL = `${BASE_API_URL}/dailies`;

export const createDaily = async (clientId, dailyData) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      ...dailyData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create daily");
  }

  return response.json();
};

export const getClientDailies = async (clientId) => {
  const response = await fetch(`${API_URL}/client/${clientId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch client dailies");
  }

  return response.json();
};

export const getAllDailies = async () => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dailies");
  }

  return response.json();
};
