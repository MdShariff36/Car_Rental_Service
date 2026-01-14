import { API_BASE } from "../base/config.js";
import { getToken } from "../base/storage.js";

export const api = async (path, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `API error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("API call failed:", err);
    throw err;
  }
};
