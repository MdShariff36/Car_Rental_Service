import { api } from "../core/api.js";

export function createBooking(bookingData) {
  return api("/bookings", "POST", bookingData);
}

export function getUserBookings() {
  return api("/bookings/me");
}
