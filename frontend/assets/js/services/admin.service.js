// FILE: assets/js/services/admin.service.js

import { storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

class AdminService {
  async getDashboardStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = storage.get("users", []);
    const cars = storage.get("cars", []);
    const bookings = storage.get("bookings", []);
    const payments = storage.get("payments", []);

    const totalRevenue = payments
      .filter((p) => p.status === CONFIG.PAYMENT.STATUS.COMPLETED)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const activeBookings = bookings.filter(
      (b) =>
        b.status === CONFIG.BOOKING.STATUS.CONFIRMED ||
        b.status === CONFIG.BOOKING.STATUS.ONGOING,
    ).length;

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyRevenue = payments
      .filter((p) => {
        const date = new Date(p.createdAt);
        return (
          date.getMonth() === thisMonth &&
          date.getFullYear() === thisYear &&
          p.status === CONFIG.PAYMENT.STATUS.COMPLETED
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      totalUsers: users.length,
      totalCars: cars.length,
      totalBookings: bookings.length,
      activeBookings,
      totalRevenue,
      monthlyRevenue,
      recentBookings: bookings.slice(0, 5),
    };
  }

  async getReports(type = "monthly") {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const bookings = storage.get("bookings", []);
    const payments = storage.get("payments", []);
    const cars = storage.get("cars", []);

    const now = new Date();
    let startDate;

    if (type === "daily") {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (type === "monthly") {
      startDate = new Date(now.setMonth(now.getMonth() - 12));
    } else {
      startDate = new Date(now.setFullYear(now.getFullYear() - 5));
    }

    const filteredBookings = bookings.filter(
      (b) => new Date(b.createdAt) >= startDate,
    );

    const filteredPayments = payments.filter(
      (p) =>
        new Date(p.createdAt) >= startDate &&
        p.status === CONFIG.PAYMENT.STATUS.COMPLETED,
    );

    return {
      bookings: filteredBookings.length,
      revenue: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      averageBookingValue:
        filteredPayments.length > 0
          ? filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0) /
            filteredPayments.length
          : 0,
      popularCars: this._getPopularCars(filteredBookings, cars),
    };
  }

  _getPopularCars(bookings, cars) {
    const carBookingCounts = {};

    bookings.forEach((booking) => {
      carBookingCounts[booking.carId] =
        (carBookingCounts[booking.carId] || 0) + 1;
    });

    return Object.entries(carBookingCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([carId, count]) => {
        const car = cars.find((c) => c.id === carId);
        return { car, bookingCount: count };
      });
  }

  async getSystemSettings() {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return storage.get("settings", {
      siteName: "CarRental",
      siteEmail: "info@carrental.com",
      sitePhone: "+91 1234567890",
      currency: "INR",
      commissionRate: 10,
      taxRate: 18,
      maintenanceMode: false,
    });
  }

  async updateSystemSettings(settings) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentSettings = storage.get("settings", {});
    const updatedSettings = { ...currentSettings, ...settings };

    storage.set("settings", updatedSettings);
    return updatedSettings;
  }
}

export const adminService = new AdminService();
