// FILE: assets/js/admin/cars.js

document.addEventListener("DOMContentLoaded", async function () {
  const carsContainer = document.getElementById("carsContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  await loadCars();

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => loadCars(), 500);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => loadCars());
  }

  async function loadCars() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const params = new URLSearchParams();

      if (searchInput && searchInput.value) {
        params.append("search", searchInput.value);
      }
      if (categoryFilter && categoryFilter.value) {
        params.append("category", categoryFilter.value);
      }

      const url = `http://localhost:8080/api/admin/cars?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load cars");
      }

      const cars = await response.json();
      displayCars(cars);
    } catch (error) {
      console.error("Load cars error:", error);
      showNotification("Failed to load cars", "error");
    } finally {
      hideLoader();
    }
  }

  function displayCars(cars) {
    if (!carsContainer) return;

    if (!cars || cars.length === 0) {
      carsContainer.innerHTML = '<tr><td colspan="7">No cars found</td></tr>';
      return;
    }

    carsContainer.innerHTML = cars
      .map(
        (car) => `
            <tr>
                <td>${car.id}</td>
                <td>${car.name}</td>
                <td>${car.category}</td>
                <td>${car.hostName}</td>
                <td>₹${car.pricePerDay}</td>
                <td><span class="badge badge-${car.status.toLowerCase()}">${car.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger delete-car" data-id="${car.id}">
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
    document.querySelectorAll(".delete-car").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const carId = this.dataset.id;
        if (confirm("Are you sure you want to delete this car?")) {
          await deleteCar(carId);
        }
      });
    });
  }

  async function deleteCar(carId) {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/admin/cars/${carId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      showNotification("Car deleted successfully", "success");
      await loadCars();
    } catch (error) {
      console.error("Delete car error:", error);
      showNotification("Failed to delete car", "error");
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
