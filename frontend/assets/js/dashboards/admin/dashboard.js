/**
 * Admin Dashboard
 * Manages admin dashboard data, charts, and platform statistics
 */

// Import required modules
import { showLoader, hideLoader } from "../../components/loader.js";
import { showNotification } from "../../ui/notifications.js";
import { getUserData, getAuthToken } from "../../base/storage.js";
import API_CONFIG from "../../base/config.js";

// DOM Elements - Safe checks
const statsCards = document.querySelectorAll(".stat-card h3");
const statChanges = document.querySelectorAll(".stat-change");
const recentActivityTable = document.getElementById("recentActivity");
const revenueChartCanvas = document.getElementById("revenueChart");
const bookingsChartCanvas = document.getElementById("bookingsChart");

// Dashboard data
let dashboardData = null;
let revenueChart = null;
let bookingsChart = null;

/**
 * Initialize dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeDashboard();
});

/**
 * Initialize dashboard with admin data
 */
async function initializeDashboard() {
  try {
    showLoader();

    // Get user data from storage
    const userData = getUserData();

    if (!userData || userData.role !== "ADMIN") {
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

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/admin/dashboard`, {
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

  // Load recent activity
  loadRecentActivity();

  // Initialize charts
  initializeCharts();
}

/**
 * Update stats cards with real data
 */
function updateStatsCards() {
  if (statsCards.length >= 4 && dashboardData) {
    // Total Users
    if (statsCards[0]) {
      statsCards[0].textContent = formatNumber(
        dashboardData.stats?.totalUsers || 0,
      );
    }

    // Total Cars
    if (statsCards[1]) {
      statsCards[1].textContent = formatNumber(
        dashboardData.stats?.totalCars || 0,
      );
    }

    // Active Bookings
    if (statsCards[2]) {
      statsCards[2].textContent = formatNumber(
        dashboardData.stats?.activeBookings || 0,
      );
    }

    // Monthly Revenue
    if (statsCards[3]) {
      const revenue = dashboardData.stats?.monthlyRevenue || 0;
      statsCards[3].textContent = `₹${formatCurrency(revenue)}`;
    }

    // Update stat changes
    if (statChanges.length >= 3 && dashboardData.stats) {
      // Users change
      if (statChanges[0]) {
        updateStatChange(
          statChanges[0],
          dashboardData.stats.usersChangePercent,
        );
      }

      // Cars change
      if (statChanges[1]) {
        updateStatChange(statChanges[1], dashboardData.stats.carsChangePercent);
      }

      // Revenue change
      if (statChanges[2]) {
        updateStatChange(
          statChanges[2],
          dashboardData.stats.revenueChangePercent,
        );
      }
    }
  }
}

/**
 * Update stat change indicator
 * @param {HTMLElement} element - Stat change element
 * @param {number} percent - Percentage change
 */
function updateStatChange(element, percent) {
  if (!element || percent === undefined) return;

  const isPositive = percent >= 0;
  element.className = `stat-change ${isPositive ? "positive" : "negative"}`;
  element.textContent = `${isPositive ? "+" : ""}${percent}% this month`;
}

/**
 * Load recent activity into table
 */
function loadRecentActivity() {
  if (!recentActivityTable) return;

  const activities = dashboardData?.recentActivity || [];

  if (activities.length === 0) {
    recentActivityTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty-message">
          <div class="empty-state">
            <p>No recent activity</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  recentActivityTable.innerHTML = activities
    .map((activity) => createActivityRow(activity))
    .join("");
}

/**
 * Create activity table row
 * @param {Object} activity - Activity data
 * @returns {string} - HTML string for table row
 */
function createActivityRow(activity) {
  const timeAgo = formatTimeAgo(activity.timestamp);
  const actionClass = getActionClass(activity.action);

  return `
    <tr>
      <td class="time-cell">${timeAgo}</td>
      <td>
        <div class="user-cell">
          <strong>${activity.user?.name || "Unknown User"}</strong>
          <span class="muted">${activity.user?.email || ""}</span>
        </div>
      </td>
      <td>
        <span class="action-badge ${actionClass}">${activity.action}</span>
      </td>
      <td>${activity.details || "-"}</td>
    </tr>
  `;
}

/**
 * Initialize charts
 */
function initializeCharts() {
  // Only initialize if Chart.js is available and canvases exist
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded - charts will not be displayed");
    return;
  }

  if (revenueChartCanvas) {
    initializeRevenueChart();
  }

  if (bookingsChartCanvas) {
    initializeBookingsChart();
  }
}

/**
 * Initialize revenue chart
 */
function initializeRevenueChart() {
  const ctx = revenueChartCanvas.getContext("2d");

  const chartData = dashboardData?.charts?.revenue || {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [45000, 52000, 48000, 61000, 55000, 67000],
  };

  // Destroy existing chart if it exists
  if (revenueChart) {
    revenueChart.destroy();
  }

  revenueChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Revenue (₹)",
          data: chartData.values,
          borderColor: "#14b8a6",
          backgroundColor: "rgba(20, 184, 166, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "₹" + formatCurrency(value);
            },
          },
        },
      },
    },
  });
}

/**
 * Initialize bookings chart
 */
function initializeBookingsChart() {
  const ctx = bookingsChartCanvas.getContext("2d");

  const chartData = dashboardData?.charts?.bookings || {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [65, 78, 72, 89, 85, 95],
  };

  // Destroy existing chart if it exists
  if (bookingsChart) {
    bookingsChart.destroy();
  }

  bookingsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Bookings",
          data: chartData.values,
          backgroundColor: "#0ea5e9",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

/**
 * Use default placeholder data when API is unavailable
 */
function useDefaultData() {
  // Keep the default values shown in HTML
  if (recentActivityTable) {
    recentActivityTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty-message">
          <div class="empty-state">
            <div class="empty-icon">📡</div>
            <p>Unable to Load Activity</p>
            <p class="muted">Please check your connection and try again.</p>
            <button class="btn btn-sm btn-primary" onclick="location.reload()">
              Retry
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  // Initialize charts with default data
  if (typeof Chart !== "undefined") {
    initializeCharts();
  }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  if (!num) return "0";
  return num.toLocaleString("en-IN");
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
 * Format time ago from timestamp
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Time ago string
 */
function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;

    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Recently";
  }
}

/**
 * Get action class for styling
 * @param {string} action - Action type
 * @returns {string} - CSS class name
 */
function getActionClass(action) {
  const actionMap = {
    "New Booking": "action-booking",
    "New User": "action-user",
    "Car Added": "action-car",
    "Payment Received": "action-payment",
    "Booking Cancelled": "action-cancelled",
  };

  return actionMap[action] || "action-default";
}
