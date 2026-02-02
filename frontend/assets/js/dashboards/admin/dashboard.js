// FILE: assets/js/admin/dashboard.js

document.addEventListener("DOMContentLoaded", async function () {
  await loadDashboardData();

  async function loadDashboardData() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        "http://localhost:8080/api/admin/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const data = await response.json();
      displayStats(data);
    } catch (error) {
      console.error("Dashboard error:", error);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      hideLoader();
    }
  }

  function displayStats(data) {
    // Total users
    const totalUsersElement = document.getElementById("totalUsers");
    if (totalUsersElement) {
      totalUsersElement.textContent = data.totalUsers || 0;
    }

    // Total cars
    const totalCarsElement = document.getElementById("totalCars");
    if (totalCarsElement) {
      totalCarsElement.textContent = data.totalCars || 0;
    }

    // Active bookings
    const activeBookingsElement = document.getElementById("activeBookings");
    if (activeBookingsElement) {
      activeBookingsElement.textContent = data.activeBookings || 0;
    }

    // Monthly revenue
    const monthlyRevenueElement = document.getElementById("monthlyRevenue");
    if (monthlyRevenueElement) {
      monthlyRevenueElement.textContent = formatCurrency(
        data.monthlyRevenue || 0,
      );
    }

    // Recent activity
    if (data.recentActivity) {
      displayRecentActivity(data.recentActivity);
    }
  }

  function displayRecentActivity(activities) {
    const container = document.getElementById("recentActivity");
    if (!container) return;

    if (!activities || activities.length === 0) {
      container.innerHTML = '<tr><td colspan="4">No recent activity</td></tr>';
      return;
    }

    container.innerHTML = activities
      .map(
        (activity) => `
            <tr>
                <td>${formatDate(activity.timestamp)}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td>${activity.details}</td>
            </tr>
        `,
      )
      .join("");
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
