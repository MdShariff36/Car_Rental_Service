import { api } from "../core/api.js";

export const users = () => api("/admin/users");
