import { bookCar } from "../services/booking.service.js";
window.book = () => bookCar({ carId: 1, days: 2 });
