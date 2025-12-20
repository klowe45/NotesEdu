import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://notesedu.onrender.com/api";

// Create a new rating
export const createRating = async (ratingData) => {
  try {
    const response = await axios.post(`${API_URL}/ratings`, ratingData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating rating:", error);
    throw error;
  }
};

// Get ratings for a specific client
export const getRatingsByClient = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/ratings/client/${clientId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

// Get ratings for a specific daily
export const getRatingsByDaily = async (dailyId) => {
  try {
    const response = await axios.get(`${API_URL}/ratings/daily/${dailyId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

// Get all ratings
export const getAllRatings = async () => {
  try {
    const response = await axios.get(`${API_URL}/ratings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

// Update a rating
export const updateRating = async (ratingId, ratingData) => {
  try {
    const response = await axios.put(
      `${API_URL}/ratings/${ratingId}`,
      ratingData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating rating:", error);
    throw error;
  }
};

// Delete a rating
export const deleteRating = async (ratingId) => {
  try {
    const response = await axios.delete(`${API_URL}/ratings/${ratingId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting rating:", error);
    throw error;
  }
};
