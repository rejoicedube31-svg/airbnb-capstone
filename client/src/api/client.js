/**
 * API helpers + auth token storage for the React client.
 */
function resolveApiUrl() {
  const configured = import.meta.env.VITE_API_URL;

  if (import.meta.env.PROD) {
    // Same-origin Heroku deploy — ignore accidental localhost from build env
    if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
      return configured;
    }
    return "";
  }

  return configured || "http://localhost:5000";
}

export const API_URL = resolveApiUrl();

const TOKEN_KEY = "airbnb_capstone_token";
const USER_KEY = "airbnb_capstone_user";

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
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-changed"));
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

export async function cancelReservation(id) {
  return apiDelete(`/api/reservations/${id}`, true);
}

export async function loginUser(email, password) {
  const data = await apiPost("/api/users/login", { email, password });
  saveAuth(data.token, data.user);
  return data;
}

const PLACEHOLDER_COUNT = 5;

export function localPlaceholder(index = 0) {
  const n = (index % PLACEHOLDER_COUNT) + 1;
  return `/images/placeholder-${n}.svg`;
}

export function listingImageUrl(path, index = 0) {
  if (!path) return localPlaceholder(index);
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
  if (path.startsWith("/images/")) return path;
  return localPlaceholder(index);
}

export function onListingImageError(event, index = 0) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = localPlaceholder(index);
}

export function imageUrl(path) {
  return listingImageUrl(path, 0);
}

/** Match backend night calculation */
export function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end - start) / msPerDay);
}

export function calculateBookingTotal(listing, nights) {
  const subtotal = listing.price * nights;
  const total =
    subtotal -
    (listing.weeklyDiscount || 0) +
    (listing.cleaningFee || 0) +
    (listing.serviceFee || 0) +
    (listing.occupancyTaxes || 0);

  return { subtotal, total };
}
