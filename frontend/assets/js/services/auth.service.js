import { api } from "../core/api.js";
import { storage } from "../base/storage.js";

export async function login(data) {
  const res = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  storage.set("token", res.token);
  storage.set("user", res.user);
}
