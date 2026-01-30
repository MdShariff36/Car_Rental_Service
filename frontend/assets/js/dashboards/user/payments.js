// ============================================================================
// FILE: assets/js/dashboards/user/payments.js
// ============================================================================

/**
 * Payments Page
 * User's payment history
 */

import UserService from "../../services/user.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarUser from "../../components/sidebar-user.js";

const PaymentsPage = {
  init() {
    if (!AuthGuard.requireRole("USER")) return;

    SidebarUser.init();

    this.loadPayments();
  },

  async loadPayments() {
    const container = document.getElementById("paymentsContainer");

    if (!container) return;

    Loader.show("Loading payments...");

    try {
      const response = await UserService.getPayments();

      Loader.hide();

      if (response.success && response.data) {
        if (response.data.length === 0) {
          container.innerHTML =
            '<tr><td colspan="6" class="text-center">No payments found</td></tr>';
        } else {
          container.innerHTML = response.data
            .map((payment) => this.createPaymentRow(payment))
            .join("");
        }
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load payments");
      console.error("Error:", error);
    }
  },

  createPaymentRow(payment) {
    const statusClass =
      {
        SUCCESS: "badge-success",
        PENDING: "badge-warning",
        FAILED: "badge-danger",
        REFUNDED: "badge-info",
      }[payment.status] || "badge-secondary";

    return `
      <tr>
        <td>#${payment.id}</td>
        <td>${Helpers.formatDate(payment.createdAt)}</td>
        <td>#${payment.bookingId}</td>
        <td>${payment.paymentMethod}</td>
        <td>${Helpers.formatCurrency(payment.amount)}</td>
        <td><span class="badge ${statusClass}">${payment.status}</span></td>
      </tr>
    `;
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => PaymentsPage.init());
} else {
  PaymentsPage.init();
}

export default PaymentsPage;
