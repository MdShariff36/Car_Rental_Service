/**
 * Host Dashboard
 * Manages host dashboard data and car listings
 */

// Import required modules
import { showLoader, hideLoader } from "../../components/loader.js";
import { showNotification } from "../../ui/notifications.js";
import { getUserData, getAuthToken } from "../../base/storage.js";
import API_CONFIG from "../../base/config.js";

// DOM Elements - Safe checks
const statsCards = document.querySelectorAll(".stat-card h3");
const recentBookingsTable = document.getElementById("recentBookings");

// Dashboard data
let dashboardData = null;

/**
 * Initialize dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});

/**
 * Initialize dashboard with host data
 */
async function initializeDashboard() {
  try {
    showLoader();

    // Get user data from storage
    const userData = getUserData();

    if (!userData || userData.role !== "HOST") {
      window.location.href = "../login.html";
      return;
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

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/host/dashboard`, {
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

  // Update stats cards
  updateStatsCards();

  // Load recent bookings
  loadRecentBookings();
}

/**
 * Update stats cards with real data
 */
function updateStatsCards() {
  if (statsCards.length >= 4 && dashboardData) {
    // Monthly Earnings
    if (statsCards[0]) {
      const earnings = dashboardData.stats?.monthlyEarnings || 0;
      statsCards[0].textContent = `₹${formatCurrency(earnings)}`;
    }

    // Total Cars
    if (statsCards[1]) {
      statsCards[1].textContent = dashboardData.stats?.totalCars || 0;
    }

    // Active Bookings
    if (statsCards[2]) {
      statsCards[2].textContent = dashboardData.stats?.activeBookings || 0;
    }

    // Average Rating
    if (statsCards[3]) {
      const rating = dashboardData.stats?.averageRating || 0;
      statsCards[3].textContent = rating.toFixed(1);
    }
  }
}

/**
 * Load recent bookings into table
 */
function loadRecentBookings() {
  if (!recentBookingsTable) return;

  const bookings = dashboardData?.recentBookings || [];

  if (bookings.length === 0) {
    recentBookingsTable.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">
          <div class="empty-state">
            <p>No recent bookings found</p>
            <p class="muted">Bookings for your cars will appear here</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  recentBookingsTable.innerHTML = bookings
    .map((booking) => createBookingRow(booking))
    .join("");
}

/**
 * Create booking table row
 * @param {Object} booking - Booking data
 * @returns {string} - HTML string for table row
 */
function createBookingRow(booking) {
  const statusClass = getStatusClass(booking.status);
  const dates = `${formatShortDate(booking.pickupDate)} - ${formatShortDate(
    booking.dropDate,
  )}`;

  return `
    <tr>
      <td>
        <div class="car-cell">
          <img src="${
            booking.car?.image || "../assets/images/car-placeholder.jpg"
          }" 
               alt="${booking.car?.name}" 
               class="car-thumbnail" />
          <span>${booking.car?.name || "Unknown Car"}</span>
        </div>
      </td>
      <td>
        <div class="customer-cell">
          <strong>${booking.customer?.name || "Unknown Customer"}</strong>
          <span class="muted">${booking.customer?.phone || ""}</span>
        </div>
      </td>
      <td>${dates}</td>
      <td><strong>₹${formatCurrency(booking.totalAmount)}</strong></td>
      <td>
        <span class="status-badge ${statusClass}">${booking.status}</span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-outline" 
                  onclick="window.viewBookingDetails('${booking.id}')">
            View
          </button>
          ${
            booking.status === "Pending"
              ? `
            <button class="btn btn-sm btn-primary" 
                    onclick="window.approveBooking('${booking.id}')">
              Approve
            </button>
          `
              : ""
          }
        </div>
      </td>
    </tr>
  `;
}

/**
 * Use default placeholder data when API is unavailable
 */
function useDefaultData() {
  // Keep the default values shown in HTML
  if (recentBookingsTable) {
    recentBookingsTable.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">
          <div class="empty-state">
            <div class="empty-icon">📡</div>
            <p>Unable to Load Bookings</p>
            <p class="muted">Please check your connection and try again.</p>
            <button class="btn btn-sm btn-primary" onclick="location.reload()">
              Retry
            </button>
          </div>
        </td>
      </tr>
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
 * Format short date string
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
function formatShortDate(dateString) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
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
    Active: "status-active",
  };

  return statusMap[status] || "status-default";
}

/**
 * View booking details
 * @param {string} bookingId - Booking ID
 */
window.viewBookingDetails = function (bookingId) {
  window.location.href = `manage-cars.html?booking=${bookingId}`;
};

/**
 * Approve booking
 * @param {string} bookingId - Booking ID
 */
window.approveBooking = async function (bookingId) {
  if (!confirm("Are you sure you want to approve this booking?")) {
    return;
  }

  try {
    showLoader();

    const token = getAuthToken();
    const response = await fetch(
      `${API_CONFIG.API_BASE_URL}/host/bookings/${bookingId}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    hideLoader();

    if (response.ok && data.success) {
      showNotification("Booking approved successfully", "success");
      // Refresh bookings
      await fetchDashboardData();
    } else {
      showNotification(data.message || "Failed to approve booking", "error");
    }
  } catch (error) {
    hideLoader();
    console.error("Error approving booking:", error);
    showNotification("Failed to approve booking", "error");
  }
};
