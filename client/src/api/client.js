/**
 * Base URL for the Express API (backend).
 * Why: React runs on :5173, API on :5000 — we need the full backend address.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiGet(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

/** Build full URL for uploaded listing images */
export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}
