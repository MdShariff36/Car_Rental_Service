// FILE: assets/js/dashboards/admin/users.js

import { requireAdmin } from "../../../core/auth-guard.js";
import { initAdminSidebar } from "../../../components/sidebar-admin.js";
import { userService } from "../../../services/user.service.js";
import { formatDate } from "../../../base/helpers.js";
import { showLoader, hideLoader } from "../../../ui/loader.js";
import { showNotification } from "../../../ui/notifications.js";
import { confirmModal } from "../../../components/modal.js";

export const initAdminUsers = async () => {
  if (!requireAdmin()) return;

  initAdminSidebar();
  await loadUsers();
  setupSearch();
};

let allUsers = [];

const loadUsers = async () => {
  showLoader();

  try {
    allUsers = await userService.getAllUsers();
    displayUsers(allUsers);
  } catch (error) {
    console.error("Failed to load users:", error);
  } finally {
    hideLoader();
  }
};

const displayUsers = (users) => {
  const container = document.querySelector("#users-table");
  if (!container) return;

  if (users.length === 0) {
    container.innerHTML = '<p class="text-center">No users found.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || "N/A"}</td>
            <td><span class="badge bg-${getRoleBadge(user.role)}">${user.role}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
              <button class="btn btn-sm btn-danger" data-delete-user="${user.id}">Delete</button>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  setupUserActions();
};

const setupUserActions = () => {
  document.querySelectorAll("[data-delete-user]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.getAttribute("data-delete-user");

      const confirmed = await confirmModal(
        "Are you sure you want to delete this user?",
      );
      if (!confirmed) return;

      showLoader();

      try {
        await userService.deleteUser(userId);
        showNotification("User deleted successfully", "success");
        await loadUsers();
      } catch (error) {
        showNotification("Failed to delete user", "error");
      } finally {
        hideLoader();
      }
    });
  });
};

const setupSearch = () => {
  const searchInput = document.querySelector("#user-search");

  searchInput?.addEventListener("input", async (e) => {
    const searchTerm = e.target.value;

    if (!searchTerm) {
      displayUsers(allUsers);
      return;
    }

    try {
      const filtered = await userService.searchUsers(searchTerm);
      displayUsers(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    }
  });
};

const getRoleBadge = (role) => {
  const badges = {
    admin: "danger",
    host: "warning",
    user: "primary",
  };
  return badges[role] || "secondary";
};
