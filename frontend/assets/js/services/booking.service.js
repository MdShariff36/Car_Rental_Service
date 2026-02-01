// FILE: assets/js/services/booking.service.js

import { storage } from "../base/storage.js";
import { generateId } from "../base/helpers.js";
import { CONFIG } from "../base/config.js";

class BookingService {
  async createBooking(bookingData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const bookings = storage.get("bookings", []);
    const user = storage.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const newBooking = {
      id: generateId(),
      userId: user.id,
      carId: bookingData.carId,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalDays: bookingData.totalDays,
      pricePerDay: bookingData.pricePerDay,
      totalAmount: bookingData.totalAmount,
      status: CONFIG.BOOKING.STATUS.PENDING,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      additionalNotes: bookingData.additionalNotes || "",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    storage.set("bookings", bookings);

    return newBooking;
  }

  async getUserBookings(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const bookings = storage.get("bookings", []);
    const cars = storage.get("cars", []);

    const userBookings = bookings
      .filter((b) => b.userId === userId)
      .map((booking) => {
        const car = cars.find((c) => c.id === booking.carId);
        return { ...booking, car };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return userBookings;
  }

  async getBookingById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const bookings = storage.get("bookings", []);
    const cars = storage.get("cars", []);

    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    const car = cars.find((c) => c.id === booking.carId);
    return { ...booking, car };
  }

  async updateBookingStatus(id, status) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const bookings = storage.get("bookings", []);
    const bookingIndex = bookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }

    bookings[bookingIndex].status = status;
    storage.set("bookings", bookings);

    return bookings[bookingIndex];
  }

  async cancelBooking(id) {
    return this.updateBookingStatus(id, CONFIG.BOOKING.STATUS.CANCELLED);
  }

  async getAllBookings() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const bookings = storage.get("bookings", []);
    const cars = storage.get("cars", []);
    const users = storage.get("users", []);

    return bookings
      .map((booking) => {
        const car = cars.find((c) => c.id === booking.carId);
        const user = users.find((u) => u.id === booking.userId);
        return { ...booking, car, user };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getHostBookings(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const bookings = storage.get("bookings", []);
    const cars = storage.get("cars", []);
    const users = storage.get("users", []);

    const hostCars = cars.filter((c) => c.hostId === hostId);
    const hostCarIds = hostCars.map((c) => c.id);

    return bookings
      .filter((b) => hostCarIds.includes(b.carId))
      .map((booking) => {
        const car = cars.find((c) => c.id === booking.carId);
        const user = users.find((u) => u.id === booking.userId);
        return { ...booking, car, user };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getBookingStats(userId, role) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let bookings;

    if (role === CONFIG.AUTH.ROLES.ADMIN) {
      bookings = storage.get("bookings", []);
    } else if (role === CONFIG.AUTH.ROLES.HOST) {
      const cars = storage.get("cars", []);
      const hostCars = cars.filter((c) => c.hostId === userId);
      const hostCarIds = hostCars.map((c) => c.id);
      bookings = storage
        .get("bookings", [])
        .filter((b) => hostCarIds.includes(b.carId));
    } else {
      bookings = storage.get("bookings", []).filter((b) => b.userId === userId);
    }

    return {
      total: bookings.length,
      pending: bookings.filter(
        (b) => b.status === CONFIG.BOOKING.STATUS.PENDING,
      ).length,
      confirmed: bookings.filter(
        (b) => b.status === CONFIG.BOOKING.STATUS.CONFIRMED,
      ).length,
      ongoing: bookings.filter(
        (b) => b.status === CONFIG.BOOKING.STATUS.ONGOING,
      ).length,
      completed: bookings.filter(
        (b) => b.status === CONFIG.BOOKING.STATUS.COMPLETED,
      ).length,
      cancelled: bookings.filter(
        (b) => b.status === CONFIG.BOOKING.STATUS.CANCELLED,
      ).length,
    };
  }
}

export const bookingService = new BookingService();
