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
