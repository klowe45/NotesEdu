import { API_URL } from "../config/api";

// Get all categories for a teacher
export const getCategoriesByTeacher = async (teacherId) => {
  const response = await fetch(`${API_URL}/categories/teacher/${teacherId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

// Get all categories for an organization
export const getCategoriesByOrganization = async (orgId) => {
  const response = await fetch(`${API_URL}/categories/organization/${orgId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

// Create a new category for a teacher
export const createCategory = async (teacherId, name) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      teacher_id: teacherId,
      name: name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create category");
  }

  return response.json();
};

// Create a new category for an organization
export const createOrgCategory = async (orgId, name) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      org_id: orgId,
      name: name,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create category");
  }

  return response.json();
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return response.json();
};

// Initialize default categories for a teacher
export const initializeDefaultCategories = async (teacherId) => {
  const response = await fetch(`${API_URL}/categories/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      teacher_id: teacherId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to initialize categories");
  }

  return response.json();
};

// Initialize default categories for an organization
export const initializeOrgDefaultCategories = async (orgId) => {
  const response = await fetch(`${API_URL}/categories/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      org_id: orgId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to initialize categories");
  }

  return response.json();
};
