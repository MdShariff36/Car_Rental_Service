import { storage } from "../base/storage.js";

export function requireAuth(role) {
  const user = storage.get("user");
  if (!user || (role && user.role !== role)) {
    location.href = "/login.html";
  }
}
