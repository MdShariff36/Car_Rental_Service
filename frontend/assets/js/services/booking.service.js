import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

export const BookingService = {
  create(booking) {
    const bookings = Storage.get(CONFIG.STORAGE_KEYS.BOOKINGS) || [];
    bookings.push(booking);
    Storage.set(CONFIG.STORAGE_KEYS.BOOKINGS, bookings);
  },

  getAll() {
    return Storage.get(CONFIG.STORAGE_KEYS.BOOKINGS) || [];
  },
};
