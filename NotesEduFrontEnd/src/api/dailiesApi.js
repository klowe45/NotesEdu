const API_URL = "http://localhost:4000/api/dailies";

export const createDaily = async (studentId, dailyData) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: studentId,
      ...dailyData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create daily");
  }

  return response.json();
};

export const getStudentDailies = async (studentId) => {
  const response = await fetch(`${API_URL}/student/${studentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch student dailies");
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
