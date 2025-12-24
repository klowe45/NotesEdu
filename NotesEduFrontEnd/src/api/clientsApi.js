import { API_URL } from '../config/api';

const API = API_URL;

export async function getAllClients(viewerId = null) {
  const url = viewerId
    ? `${API}/clients?viewerId=${viewerId}`
    : `${API}/clients`;
  const r = await fetch(url);
  return r.json();
}

export async function getClientById(id) {
  const r = await fetch(`${API}/clients/${id}`);
  return r.json();
}

export async function createClient(payload) {
  const r = await fetch(`${API}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function deleteClient(id) {
  const r = await fetch(`${API}/clients/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!r.ok) {
    throw new Error("Failed to delete client");
  }
  return r.json();
}
