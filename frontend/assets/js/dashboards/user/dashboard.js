/**
 * User Dashboard
 * Manages user dashboard data and interactions
 */

// Import required modules
import { showLoader, hideLoader } from "../../components/loader.js";
import { showNotification } from "../../ui/notifications.js";
import { getUserData, getAuthToken } from "../../base/storage.js";
import API_CONFIG from "../../base/config.js";

// DOM Elements - Safe checks
const userNameElement = document.getElementById("userName");
const upcomingTripsContainer = document.getElementById("upcomingTrips");
const statsCards = document.querySelectorAll(".stat-card h3");

// Dashboard data
let dashboardData = null;

/**
 * Initialize dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});

/**
 * Initialize dashboard with user data
 */
async function initializeDashboard() {
  try {
    showLoader();

    // Get user data from storage
    const userData = getUserData();

    if (!userData) {
      window.location.href = "../login.html";
      return;
    }

    // Display user name
    if (userNameElement) {
      userNameElement.textContent = userData.firstName || "User";
    }

    // Fetch dashboard data from API
    await fetchDashboardData();

    hideLoader();
  } catch (error) {
    hideLoader();
    console.error("Dashboard initialization error:", error);
    showNotification("Failed to load dashboard data", "error");
  }
}

/**
 * Fetch dashboard data from API
 */
async function fetchDashboardData() {
  try {
    const token = getAuthToken();

    if (!token) {
      window.location.href = "../login.html";
      return;
    }

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/user/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "../login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();

    if (data.success) {
      dashboardData = data.data;
      updateDashboardUI();
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Use default/placeholder data if API fails
    useDefaultData();
  }
}

/**
 * Update dashboard UI with fetched data
 */
function updateDashboardUI() {
  if (!dashboardData) return;

  // Update stats cards (existing h3 elements in HTML)
  updateStatsCards();

  // Load upcoming trips
  loadUpcomingTrips();
}

/**
 * Update stats cards with real data
 */
function updateStatsCards() {
  if (statsCards.length >= 4 && dashboardData) {
    // Active Bookings
    if (statsCards[0]) {
      statsCards[0].textContent = dashboardData.stats?.activeBookings || 0;
    }

    // Completed Trips
    if (statsCards[1]) {
      statsCards[1].textContent = dashboardData.stats?.completedTrips || 0;
    }

    // Total Spent
    if (statsCards[2]) {
      const totalSpent = dashboardData.stats?.totalSpent || 0;
      statsCards[2].textContent = `₹${formatCurrency(totalSpent)}`;
    }

    // Saved Cars
    if (statsCards[3]) {
      statsCards[3].textContent = dashboardData.stats?.savedCars || 0;
    }
  }
}

/**
 * Load upcoming trips into the trips list
 */
function loadUpcomingTrips() {
  if (!upcomingTripsContainer) return;

  const trips = dashboardData?.upcomingTrips || [];

  if (trips.length === 0) {
    upcomingTripsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚗</div>
        <h3>No Upcoming Trips</h3>
        <p>You don't have any upcoming bookings.</p>
        <a href="../cars.html" class="btn btn-primary">Browse Cars</a>
      </div>
    `;
    return;
  }

  upcomingTripsContainer.innerHTML = trips
    .map((trip) => createTripCard(trip))
    .join("");
}

/**
 * Create trip card HTML
 * @param {Object} trip - Trip data
 * @returns {string} - HTML string
 */
function createTripCard(trip) {
  const pickupDate = formatDate(trip.pickupDate);
  const dropDate = formatDate(trip.dropDate);
  const statusClass = getStatusClass(trip.status);

  return `
    <div class="trip-card">
      <div class="trip-image">
        <img src="${trip.car?.image || "../assets/images/car-placeholder.jpg"}" 
             alt="${trip.car?.name || "Car"}" />
      </div>
      <div class="trip-details">
        <div class="trip-header">
          <h3>${trip.car?.name || "Unknown Car"}</h3>
          <span class="trip-status ${statusClass}">${trip.status}</span>
        </div>
        <div class="trip-info">
          <div class="info-row">
            <span class="icon">📅</span>
            <span>Pickup: ${pickupDate}</span>
          </div>
          <div class="info-row">
            <span class="icon">📅</span>
            <span>Drop-off: ${dropDate}</span>
          </div>
          <div class="info-row">
            <span class="icon">📍</span>
            <span>${trip.pickupLocation || "Location not specified"}</span>
          </div>
          <div class="info-row">
            <span class="icon">💰</span>
            <span>₹${formatCurrency(trip.totalAmount)}</span>
          </div>
        </div>
        <div class="trip-actions">
          <a href="my-bookings.html?id=${trip.id}" class="btn btn-outline btn-sm">
            View Details
          </a>
          ${
            trip.status === "Confirmed"
              ? `<button class="btn btn-primary btn-sm" onclick="window.modifyBooking('${trip.id}')">
                   Modify
                 </button>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

/**
 * Use default placeholder data when API is unavailable
 */
function useDefaultData() {
  // Keep the default values shown in HTML
  // Just show empty state for upcoming trips
  if (upcomingTripsContainer) {
    upcomingTripsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📡</div>
        <h3>Unable to Load Trips</h3>
        <p>Please check your connection and try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount
 */
function formatCurrency(amount) {
  if (!amount) return "0";

  // Handle large amounts (lakhs)
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)}L`;
  }

  return amount.toLocaleString("en-IN");
}

/**
 * Format date string
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return "Date not available";

  try {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-IN", options);
  } catch (error) {
    return dateString;
  }
}

/**
 * Get status class for styling
 * @param {string} status - Booking status
 * @returns {string} - CSS class name
 */
function getStatusClass(status) {
  const statusMap = {
    Confirmed: "status-confirmed",
    Pending: "status-pending",
    Completed: "status-completed",
    Cancelled: "status-cancelled",
  };

  return statusMap[status] || "status-default";
}

/**
 * Modify booking - exposed to global scope for onclick handler
 * @param {string} bookingId - Booking ID
 */
window.modifyBooking = function (bookingId) {
  window.location.href = `my-bookings.html?modify=${bookingId}`;
};
