import { getUser } from "../base/storage.js";

export const requireAuth = (role = null) => {
  const user = getUser();
  if (!user) return (window.location.href = "/login.html");
  if (role && user.role !== role)
    return (window.location.href = "/unauthorized.html");
};
