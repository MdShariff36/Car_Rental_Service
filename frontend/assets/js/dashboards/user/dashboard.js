import { requireAuth } from "../../core/auth-guard.js";
requireAuth("USER");

import { requireAuth } from "../../core/auth-guard.js";
import { BookingService } from "../../services/booking.service.js";

requireAuth("USER");

const bookings = BookingService.getAll();
document.getElementById("count").innerText = bookings.length;
