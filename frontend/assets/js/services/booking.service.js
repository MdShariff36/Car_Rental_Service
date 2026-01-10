import { api } from "../core/api.js";

export const bookCar = (data) =>
  api("/bookings", { method: "POST", body: JSON.stringify(data) });
