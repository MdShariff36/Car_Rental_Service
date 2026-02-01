// FILE: assets/js/services/host.service.js

import { storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

class HostService {
  async getHostDashboard(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    const bookings = storage.get("bookings", []);
    const payments = storage.get("payments", []);

    const hostCars = cars.filter((c) => c.hostId === hostId);
    const hostCarIds = hostCars.map((c) => c.id);
    const hostBookings = bookings.filter((b) => hostCarIds.includes(b.carId));

    const totalEarnings = hostBookings
      .filter((b) => b.status === CONFIG.BOOKING.STATUS.COMPLETED)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const activeBookings = hostBookings.filter(
      (b) =>
        b.status === CONFIG.BOOKING.STATUS.CONFIRMED ||
        b.status === CONFIG.BOOKING.STATUS.ONGOING,
    ).length;

    return {
      totalCars: hostCars.length,
      activeCars: hostCars.filter((c) => c.available).length,
      totalBookings: hostBookings.length,
      activeBookings,
      totalEarnings,
      recentBookings: hostBookings.slice(0, 5),
    };
  }

  async getHostEarnings(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    const bookings = storage.get("bookings", []);

    const hostCars = cars.filter((c) => c.hostId === hostId);
    const hostCarIds = hostCars.map((c) => c.id);
    const completedBookings = bookings.filter(
      (b) =>
        hostCarIds.includes(b.carId) &&
        b.status === CONFIG.BOOKING.STATUS.COMPLETED,
    );

    const totalEarnings = completedBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0,
    );
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyEarnings = completedBookings
      .filter((b) => {
        const date = new Date(b.createdAt);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      })
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      total: totalEarnings,
      thisMonth: monthlyEarnings,
      bookingsCount: completedBookings.length,
      earnings: completedBookings.map((b) => ({
        id: b.id,
        amount: b.totalAmount,
        date: b.createdAt,
        carId: b.carId,
      })),
    };
  }

  async getHostCars(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    return cars.filter((c) => c.hostId === hostId);
  }

  async getHostBookings(hostId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cars = storage.get("cars", []);
    const bookings = storage.get("bookings", []);
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
}

export const hostService = new HostService();
