import { API_URL } from '../config/api';

const API = API_URL;

export async function getClients() {
  const r = await fetch(`${API}/clients`);
  return r.json();
}

export async function getClientNotes(id) {
  const r = await fetch(`${API}/clients/${id}/notes`);
  return r.json();
}

export async function createNote(clientId, payload) {
  const r = await fetch(`${API}/clients/${clientId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}
