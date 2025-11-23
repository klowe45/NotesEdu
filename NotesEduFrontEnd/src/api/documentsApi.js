const API_URL = "http://localhost:4000/api/documents";

export const uploadDocuments = async (clientId, files, author) => {
  const formData = new FormData();
  formData.append("clientId", clientId);
  formData.append("author", author);

  // Append all files to FormData
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload documents");
  }

  return response.json();
};

export const getClientDocuments = async (clientId) => {
  const response = await fetch(`${API_URL}/client/${clientId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

export const getAllDocuments = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

export const sendDocumentByEmail = async (documentId, recipientEmail, recipientName, message, senderName) => {
  const response = await fetch(`${API_URL}/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      recipientEmail,
      recipientName,
      message,
      senderName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send email");
  }

  return response.json();
};
