const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://notesedu.onrender.com/api";

export const saveMedication = async (medicationData) => {
  const response = await fetch(`${API_BASE_URL}/medication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(medicationData),
  });

  if (!response.ok) {
    throw new Error("Failed to save medication");
  }

  return response.json();
};

export const getMedicationByClient = async (clientId) => {
  const response = await fetch(`${API_BASE_URL}/medication/client/${clientId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch medication");
  }

  return response.json();
};

export const getAllMedication = async () => {
  const response = await fetch(`${API_BASE_URL}/medication`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch medication");
  }

  return response.json();
};

export const deleteMedication = async (medicationId) => {
  const response = await fetch(`${API_BASE_URL}/medication/${medicationId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete medication");
  }

  return response.status === 204;
};
