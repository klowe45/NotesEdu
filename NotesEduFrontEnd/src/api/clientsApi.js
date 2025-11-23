const API = "http://localhost:4000/api";

export async function getAllClients() {
  const r = await fetch(`${API}/clients`);
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
