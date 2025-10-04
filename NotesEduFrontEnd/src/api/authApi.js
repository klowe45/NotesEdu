const API = "http://localhost:4000/api";

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
