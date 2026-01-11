import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

export function requireAuth(role = null) {
  const user = Storage.get(CONFIG.STORAGE_KEYS.USER);

  if (!user) {
    alert("Please login first");
    window.location.href = "/frontend/login.html";
    return;
  }

  if (role && user.role !== role) {
    alert("Unauthorized access");
    history.back();
  }
}
