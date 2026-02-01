// FILE: assets/js/dashboards/user/payments.js

import { requireUser } from "../../../core/auth-guard.js";
import { initUserSidebar } from "../../../components/sidebar-user.js";
import { paymentService } from "../../../services/payment.service.js";
import { storage } from "../../../base/storage.js";
import { formatCurrency, formatDateTime } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";

export const initPayments = async () => {
  if (!requireUser()) return;

  initUserSidebar();
  await loadPayments();
};

const loadPayments = async () => {
  showLoader();

  try {
    const user = storage.getUser();
    const payments = await paymentService.getUserPayments(user.id);
    const stats = await paymentService.getPaymentStats(user.id, user.role);

    displayStats(stats);
    displayPayments(payments);
  } catch (error) {
    console.error("Failed to load payments:", error);
  } finally {
    hideLoader();
  }
};

const displayStats = (stats) => {
  const statsContainer = document.querySelector("#payment-stats");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${stats.total}</h3>
        <p>Total Payments</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${formatCurrency(stats.totalAmount)}</h3>
        <p>Total Spent</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <h3>${stats.completed}</h3>
        <p>Successful</p>
      </div>
    </div>
  `;
};

const displayPayments = (payments) => {
  const container = document.querySelector("#payments-list");
  if (!container) return;

  if (payments.length === 0) {
    container.innerHTML = '<p class="text-center">No payments found.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Method</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${payments
          .map(
            (payment) => `
          <tr>
            <td>${payment.transactionId || payment.id}</td>
            <td>${formatDateTime(payment.createdAt)}</td>
            <td>${payment.method}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td><span class="badge bg-${getStatusColor(payment.status)}">${payment.status}</span></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "warning",
    completed: "success",
    failed: "danger",
    refunded: "info",
  };
  return colors[status] || "secondary";
};
