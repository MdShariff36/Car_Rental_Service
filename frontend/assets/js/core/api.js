import { CONFIG } from "../base/config.js";
import { storage } from "../base/storage.js";

export async function api(url, options = {}) {
  const token = storage.get("token");
  const res = await fetch(CONFIG.API_BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
