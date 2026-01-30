// ============================================================================
// AUTO PRIME RENTAL - USER DASHBOARDS
// All user dashboard pages
// ============================================================================

// ============================================================================
// FILE: assets/js/dashboards/user/dashboard.js
// ============================================================================

/**
 * User Dashboard
 * Main dashboard with stats and overview
 */

import UserService from "../../services/user.service.js";
import BookingService from "../../services/booking.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarUser from "../../components/sidebar-user.js";

const UserDashboard = {
  init() {
    if (!AuthGuard.requireRole("USER")) return;

    SidebarUser.init();

    this.loadDashboardStats();
    this.loadUpcomingBookings();
    this.loadRecentActivity();
  },

  async loadDashboardStats() {
    try {
      const response = await UserService.getDashboardStats();

      if (response.success && response.data) {
        this.renderStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  },

  renderStats(stats) {
    const statsData = {
      totalBookings: stats.totalBookings || 0,
      upcomingTrips: stats.upcomingTrips || 0,
      totalSpent: stats.totalSpent || 0,
      wishlistItems: stats.wishlistItems || 0,
    };

    // Update stat cards
    const totalBookingsEl = document.getElementById("totalBookings");
    if (totalBookingsEl) totalBookingsEl.textContent = statsData.totalBookings;

    const upcomingTripsEl = document.getElementById("upcomingTrips");
    if (upcomingTripsEl) upcomingTripsEl.textContent = statsData.upcomingTrips;

    const totalSpentEl = document.getElementById("totalSpent");
    if (totalSpentEl)
      totalSpentEl.textContent = Helpers.formatCurrency(statsData.totalSpent);

    const wishlistEl = document.getElementById("wishlistItems");
    if (wishlistEl) wishlistEl.textContent = statsData.wishlistItems;
  },

  async loadUpcomingBookings() {
    const container = document.getElementById("upcomingBookingsContainer");

    if (!container) return;

    try {
      const response = await BookingService.getUserBookings("CONFIRMED");

      if (response.success && response.data) {
        if (response.data.length === 0) {
          container.innerHTML =
            '<p class="text-muted">No upcoming bookings</p>';
        } else {
          container.innerHTML = response.data
            .slice(0, 3)
            .map((booking) => this.createBookingCard(booking))
            .join("");
        }
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      container.innerHTML = '<p class="text-muted">Failed to load bookings</p>';
    }
  },

  createBookingCard(booking) {
    return `
      <div class="booking-card">
        <div class="booking-car-info">
          <img src="${booking.car.image}" alt="${booking.car.name}" class="booking-car-thumb">
          <div>
            <h4>${booking.car.name}</h4>
            <p class="text-muted">${Helpers.formatDate(booking.pickupDate)} - ${Helpers.formatDate(booking.dropDate)}</p>
          </div>
        </div>
        <div class="booking-status">
          <span class="badge badge-success">Confirmed</span>
          <a href="my-bookings.html?id=${booking.id}" class="btn btn-sm btn-outline">View Details</a>
        </div>
      </div>
    `;
  },

  async loadRecentActivity() {
    const container = document.getElementById("recentActivityContainer");

    if (!container) return;

    // This would load from an activity API endpoint
    // For now, showing a placeholder
    container.innerHTML = `
      <div class="activity-item">
        <span class="activity-icon">🚗</span>
        <div class="activity-details">
          <p>Booking confirmed for <strong>Honda City</strong></p>
          <span class="activity-time">2 hours ago</span>
        </div>
      </div>
      <div class="activity-item">
        <span class="activity-icon">❤️</span>
        <div class="activity-details">
          <p>Added <strong>Toyota Fortuner</strong> to wishlist</p>
          <span class="activity-time">1 day ago</span>
        </div>
      </div>
    `;
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => UserDashboard.init());
} else {
  UserDashboard.init();
}

export default UserDashboard;
