// ============================================================================
// FILE: assets/js/dashboards/host/earnings.js
// ============================================================================

/**
 * Earnings Page
 * Host earnings and payout management
 */

import HostService from "../../services/host.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import Helpers from "../../base/helpers.js";
import SidebarHost from "../../components/sidebar-host.js";

const EarningsPage = {
  init() {
    if (!AuthGuard.requireRole("HOST")) return;

    SidebarHost.init();

    this.loadEarnings();
    this.loadPayouts();
    this.setupPayoutRequest();
  },

  async loadEarnings() {
    try {
      const response = await HostService.getEarnings("month");

      if (response.success && response.data) {
        const totalEarningsEl = document.getElementById("totalEarnings");
        if (totalEarningsEl)
          totalEarningsEl.textContent = Helpers.formatCurrency(
            response.data.total || 0,
          );

        const pendingEl = document.getElementById("pendingEarnings");
        if (pendingEl)
          pendingEl.textContent = Helpers.formatCurrency(
            response.data.pending || 0,
          );

        const availableEl = document.getElementById("availableForPayout");
        if (availableEl)
          availableEl.textContent = Helpers.formatCurrency(
            response.data.available || 0,
          );
      }
    } catch (error) {
      console.error("Error loading earnings:", error);
    }
  },

  async loadPayouts() {
    const container = document.getElementById("payoutsTableBody");

    if (!container) return;

    try {
      const response = await HostService.getPayouts();

      if (response.success && response.data) {
        container.innerHTML = response.data
          .map(
            (payout) => `
          <tr>
            <td>${Helpers.formatDate(payout.requestedAt)}</td>
            <td>${Helpers.formatCurrency(payout.amount)}</td>
            <td><span class="badge badge-${payout.status.toLowerCase()}">${payout.status}</span></td>
            <td>${payout.processedAt ? Helpers.formatDate(payout.processedAt) : "-"}</td>
          </tr>
        `,
          )
          .join("");
      }
    } catch (error) {
      console.error("Error loading payouts:", error);
    }
  },

  setupPayoutRequest() {
    const requestBtn = document.getElementById("requestPayoutBtn");

    if (!requestBtn) return;

    requestBtn.addEventListener("click", async () => {
      const amount = prompt("Enter payout amount:");

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        Notifications.error("Please enter a valid amount");
        return;
      }

      Loader.show("Requesting payout...");

      try {
        const response = await HostService.requestPayout(parseFloat(amount));

        Loader.hide();

        if (response.success) {
          Notifications.success("Payout requested successfully");
          this.loadPayouts();
        } else {
          Notifications.error(response.error || "Failed to request payout");
        }
      } catch (error) {
        Loader.hide();
        Notifications.error("Error requesting payout");
      }
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => EarningsPage.init());
} else {
  EarningsPage.init();
}

export default EarningsPage;
