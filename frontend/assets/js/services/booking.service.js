import { api } from "../core/api.js";

export const createBooking = (bookingData) =>
  api("/bookings", "POST", bookingData);
export const getUserBookings = () => api("/bookings/me");
