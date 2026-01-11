import { requireAuth } from "../core/auth-guard.js";
requireAuth();

import { BookingService } from "../services/booking.service.js";
import { Storage } from "../base/storage.js";

const car = Storage.get("selectedCar");

document.getElementById("confirmBtn").onclick = () => {
  BookingService.create({
    car,
    date: new Date().toISOString(),
  });

  window.location.href = "booking-confirm.html";
};
