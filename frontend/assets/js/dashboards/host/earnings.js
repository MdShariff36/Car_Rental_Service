// FILE: assets/js/dashboards/host/earnings.js

document.addEventListener("DOMContentLoaded", async function () {
  const earningsContainer = document.getElementById("earningsContainer");
  const totalEarningsElement = document.getElementById("totalEarnings");
  const monthlyEarningsElement = document.getElementById("monthlyEarnings");
  const pendingPayoutsElement = document.getElementById("pendingPayouts");

  await loadEarnings();

  async function loadEarnings() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/host/earnings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load earnings");
      }

      const data = await response.json();
      displayEarnings(data);
    } catch (error) {
      console.error("Load earnings error:", error);
      showNotification("Failed to load earnings data", "error");
    } finally {
      hideLoader();
    }
  }

  function displayEarnings(data) {
    // Display summary
    if (totalEarningsElement) {
      totalEarningsElement.textContent = formatCurrency(
        data.totalEarnings || 0,
      );
    }
    if (monthlyEarningsElement) {
      monthlyEarningsElement.textContent = formatCurrency(
        data.monthlyEarnings || 0,
      );
    }
    if (pendingPayoutsElement) {
      pendingPayoutsElement.textContent = formatCurrency(
        data.pendingPayouts || 0,
      );
    }

    // Display transaction list
    if (!earningsContainer) return;

    if (!data.transactions || data.transactions.length === 0) {
      earningsContainer.innerHTML =
        '<p class="empty-message">No earnings yet</p>';
      return;
    }

    earningsContainer.innerHTML = data.transactions
      .map(
        (transaction) => `
            <div class="transaction-item">
                <div class="transaction-date">${formatDate(transaction.date)}</div>
                <div class="transaction-car">${transaction.carName}</div>
                <div class="transaction-booking">${transaction.bookingNumber}</div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
                <div class="transaction-status">
                    <span class="badge badge-${transaction.status.toLowerCase()}">${transaction.status}</span>
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
