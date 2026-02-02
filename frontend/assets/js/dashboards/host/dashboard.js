// FILE: assets/js/dashboards/host/dashboard.js

document.addEventListener("DOMContentLoaded", async function () {
  await loadDashboardData();

  async function loadDashboardData() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/host/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

    // Total earnings
    const totalEarningsElement = document.getElementById("totalEarnings");
    if (totalEarningsElement) {
      totalEarningsElement.textContent = formatCurrency(
        data.totalEarnings || 0,
      );
    }

    // Monthly earnings
    const monthlyEarningsElement = document.getElementById("monthlyEarnings");
    if (monthlyEarningsElement) {
      monthlyEarningsElement.textContent = formatCurrency(
        data.monthlyEarnings || 0,
      );
    }

    // Recent bookings
    if (data.recentBookings) {
      displayRecentBookings(data.recentBookings);
    }
  }

  function displayRecentBookings(bookings) {
    const container = document.getElementById("recentBookings");
    if (!container) return;

    if (!bookings || bookings.length === 0) {
      container.innerHTML = '<p class="empty-message">No recent bookings</p>';
      return;
    }

    container.innerHTML = bookings
      .map(
        (booking) => `
            <div class="booking-item">
                <div class="booking-car">${booking.carName}</div>
                <div class="booking-user">${booking.userName}</div>
                <div class="booking-dates">${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</div>
                <div class="booking-amount">${formatCurrency(booking.amount)}</div>
                <div class="booking-status">
                    <span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
            </div>
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
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
