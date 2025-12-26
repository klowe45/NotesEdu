import { API_URL } from "../config/api";

// Get all notifications for an organization
export const getOrganizationNotifications = async (orgId) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};

// Get unread notification count
export const getUnreadCount = async (orgId) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}/unread-count`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return response.json();
};

// Create a new notification
export const createNotification = async (notification) => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create notification");
  }

  return response.json();
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
};

// Mark all notifications as read
export const markAllAsRead = async (orgId) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}/read-all`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to mark all as read");
  }

  return response.json();
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return response.json();
};

// Get welcome message for an organization
export const getWelcomeMessage = async (orgId) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}/welcome-message`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch welcome message");
  }

  return response.json();
};

// Update welcome message for an organization
export const updateWelcomeMessage = async (orgId, welcomeMessage) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}/welcome-message`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ welcome_message: welcomeMessage }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update welcome message");
  }

  return response.json();
};

// Get active notification for dashboard display
export const getActiveNotification = async (orgId) => {
  const response = await fetch(`${API_URL}/notifications/organization/${orgId}/active`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch active notification");
  }

  return response.json();
};
