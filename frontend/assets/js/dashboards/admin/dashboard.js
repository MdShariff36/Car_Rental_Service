import { requireAuth } from "../../core/auth-guard.js";

export const init = () => {
  requireAuth("USER");
  console.log("User Dashboard Loaded");
};
