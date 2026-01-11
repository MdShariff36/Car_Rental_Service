import { CONFIG } from "../base/config.js";
import { Storage } from "../base/storage.js";

export async function apiRequest(endpoint, options = {}) {
  const token = Storage.get(CONFIG.STORAGE_KEYS.TOKEN);

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}
