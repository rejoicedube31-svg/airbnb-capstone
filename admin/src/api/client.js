/**
 * API helpers + auth token storage for the admin dashboard.
 * Uses separate localStorage keys from the public client.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "airbnb_capstone_admin_token";
const USER_KEY = "airbnb_capstone_admin_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("admin-auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("admin-auth-changed"));
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }
  return data;
}

export async function apiGet(path, auth = false) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { headers });
  return parseResponse(response);
}

export async function apiPost(path, body, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}

export async function apiPut(path, body, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}

export async function apiDelete(path, auth = false) {
  const headers = {};

  if (auth) {
    const token = getToken();
    if (!token) throw new Error("Not logged in");
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers,
  });

  return parseResponse(response);
}

export async function uploadListingImage(file) {
  const token = getToken();
  if (!token) throw new Error("Not logged in");

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/api/accommodations/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return parseResponse(response);
}

export async function fetchListings(location = "") {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  const data = await apiGet(`/api/accommodations${query}`);
  return data.data || [];
}

export async function fetchListing(id) {
  const data = await apiGet(`/api/accommodations/${id}`);
  return data.data;
}

export async function createListing(body) {
  const data = await apiPost("/api/accommodations", body, true);
  return data.data;
}

export async function updateListing(id, body) {
  const data = await apiPut(`/api/accommodations/${id}`, body, true);
  return data.data;
}

export async function deleteListing(id) {
  return apiDelete(`/api/accommodations/${id}`, true);
}

export async function fetchHostReservations() {
  const data = await apiGet("/api/reservations/host", true);
  return data.data || [];
}

export async function cancelReservation(id) {
  return apiDelete(`/api/reservations/${id}`, true);
}

export async function loginHost(email, password) {
  const data = await apiPost("/api/users/login", { email, password });
  if (data.user?.role !== "host") {
    throw new Error("Admin access requires a host account.");
  }
  saveAuth(data.token, data.user);
  return data;
}

export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
  return path;
}
