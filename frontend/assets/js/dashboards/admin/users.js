// ============================================================================
// FILE: assets/js/dashboards/admin/users.js
// ============================================================================

/**
 * Admin Users Management
 * Manage all users
 */

import AdminService from "../../services/admin.service.js";
import Loader from "../../ui/loader.js";
import Notifications from "../../ui/notifications.js";
import AuthGuard from "../../core/auth-guard.js";
import SidebarAdmin from "../../components/sidebar-admin.js";

const AdminUsersPage = {
  init() {
    if (!AuthGuard.requireRole("ADMIN")) return;

    SidebarAdmin.init();

    this.loadUsers();
  },

  async loadUsers() {
    const container = document.getElementById("usersTableBody");

    if (!container) return;

    Loader.show("Loading users...");

    try {
      const response = await AdminService.getUsers();

      Loader.hide();

      if (response.success && response.data) {
        container.innerHTML = response.data
          .map((user) => this.createUserRow(user))
          .join("");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Failed to load users");
    }
  },

  createUserRow(user) {
    const statusClass = user.active ? "badge-success" : "badge-danger";
    const statusText = user.active ? "Active" : "Suspended";

    return `
      <tr>
        <td>#${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge badge-info">${user.role}</span></td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.AdminUsersPage.viewUser('${user.id}')">View</button>
          ${
            user.active
              ? `<button class="btn btn-sm btn-warning" onclick="window.AdminUsersPage.suspendUser('${user.id}')">Suspend</button>`
              : `<button class="btn btn-sm btn-success" onclick="window.AdminUsersPage.activateUser('${user.id}')">Activate</button>`
          }
        </td>
      </tr>
    `;
  },

  viewUser(userId) {
    window.location.href = `user-details.html?id=${userId}`;
  },

  async suspendUser(userId) {
    const reason = prompt("Enter reason for suspension:");
    if (!reason) return;

    Loader.show("Suspending user...");

    try {
      const response = await AdminService.suspendUser(userId, reason);

      Loader.hide();

      if (response.success) {
        Notifications.success("User suspended");
        this.loadUsers();
      } else {
        Notifications.error("Failed to suspend user");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error suspending user");
    }
  },

  async activateUser(userId) {
    Loader.show("Activating user...");

    try {
      const response = await AdminService.activateUser(userId);

      Loader.hide();

      if (response.success) {
        Notifications.success("User activated");
        this.loadUsers();
      } else {
        Notifications.error("Failed to activate user");
      }
    } catch (error) {
      Loader.hide();
      Notifications.error("Error activating user");
    }
  },
};

window.AdminUsersPage = AdminUsersPage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AdminUsersPage.init());
} else {
  AdminUsersPage.init();
}

export default AdminUsersPage;
