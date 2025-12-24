import { API_URL } from '../config/api';

const API = API_URL;

export async function signin(credentials) {
  const r = await fetch(`${API}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return r.json();
}

export async function signup(userData) {
  const r = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return r.json();
}

export async function signout() {
  const r = await fetch(`${API}/auth/signout`, {
    method: "POST",
  });
  return r.json();
}

export async function organizationSignin(credentials) {
  const r = await fetch(`${API}/auth/organization/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return r.json();
}

export async function organizationSignup(orgData) {
  const r = await fetch(`${API}/auth/organization/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orgData),
  });
  return r.json();
}

export async function createStaff(staffData) {
  const r = await fetch(`${API}/auth/staff/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  return r.json();
}

export async function getStaffList(orgId) {
  const r = await fetch(`${API}/auth/staff/${orgId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return r.json();
}

export async function getStaffMember(staffId) {
  const r = await fetch(`${API}/auth/staff/single/${staffId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return r.json();
}

export async function updateStaff(staffId, staffData) {
  const r = await fetch(`${API}/auth/staff/update/${staffId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  return r.json();
}

export async function createViewer(viewerData) {
  const r = await fetch(`${API}/auth/viewer/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(viewerData),
  });
  return r.json();
}

export async function getViewerList(orgId) {
  const r = await fetch(`${API}/auth/viewer/${orgId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return r.json();
}

export async function getViewer(viewerId) {
  const r = await fetch(`${API}/auth/viewer/single/${viewerId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return r.json();
}

export async function updateViewer(viewerId, viewerData) {
  const r = await fetch(`${API}/auth/viewer/update/${viewerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(viewerData),
  });
  return r.json();
}

export async function getViewerClients(viewerId) {
  const r = await fetch(`${API}/auth/viewer/${viewerId}/clients`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return r.json();
}

export async function updateViewerClients(viewerId, clientIds) {
  const r = await fetch(`${API}/auth/viewer/${viewerId}/clients`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientIds }),
  });
  return r.json();
}

export async function viewerSignin(credentials) {
  const r = await fetch(`${API}/auth/viewer/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return r.json();
}

export async function forgotPassword(data) {
  const r = await fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function resetPassword(data) {
  const r = await fetch(`${API}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}
