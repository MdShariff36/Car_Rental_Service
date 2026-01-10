import { api } from "../core/api.js";

export const getProfile = () => api("/users/me");
