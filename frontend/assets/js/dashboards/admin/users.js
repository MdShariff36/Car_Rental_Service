// FILE: assets/js/admin/users.js

document.addEventListener("DOMContentLoaded", async function () {
  const usersContainer = document.getElementById("usersContainer");
  const searchInput = document.getElementById("searchInput");
  const roleFilter = document.getElementById("roleFilter");

  await loadUsers();

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => loadUsers(), 500);
    });
  }

  if (roleFilter) {
    roleFilter.addEventListener("change", () => loadUsers());
  }

  async function loadUsers() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const params = new URLSearchParams();

      if (searchInput && searchInput.value) {
        params.append("search", searchInput.value);
      }
      if (roleFilter && roleFilter.value) {
        params.append("role", roleFilter.value);
      }

      const url = `http://localhost:8080/api/admin/users?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const users = await response.json();
      displayUsers(users);
    } catch (error) {
      console.error("Load users error:", error);
      showNotification("Failed to load users", "error");
    } finally {
      hideLoader();
    }
  }

  function displayUsers(users) {
    if (!usersContainer) return;

    if (!users || users.length === 0) {
      usersContainer.innerHTML = '<tr><td colspan="6">No users found</td></tr>';
      return;
    }

    usersContainer.innerHTML = users
      .map(
        (user) => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone || "N/A"}</td>
                <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `,
      )
      .join("");

    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".delete-user").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const userId = this.dataset.id;
        if (confirm("Are you sure you want to delete this user?")) {
          await deleteUser(userId);
        }
      });
    });
  }

  async function deleteUser(userId) {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      showNotification("User deleted successfully", "success");
      await loadUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      showNotification("Failed to delete user", "error");
    } finally {
      hideLoader();
    }
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
