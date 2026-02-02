// FILE: assets/js/dashboards/host/manage-cars.js

document.addEventListener("DOMContentLoaded", async function () {
  const carsContainer = document.getElementById("carsContainer");

  await loadCars();

  async function loadCars() {
    showLoader();

    try {
      const token = AuthService.getToken();
      const response = await fetch("http://localhost:8080/api/host/cars", {
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
      carsContainer.innerHTML =
        '<p class="empty-message">No cars found. Add your first car!</p>';
      return;
    }

    carsContainer.innerHTML = cars
      .map(
        (car) => `
            <div class="car-card" data-car-id="${car.id}">
                <img src="${car.primaryImage || "/assets/images/car-placeholder.jpg"}" alt="${car.name}">
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <p class="car-category">${car.category}</p>
                    <p class="car-price">₹${car.pricePerDay}/day</p>
                    <div class="car-actions">
                        <button class="btn btn-sm btn-outline edit-car" data-id="${car.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-car" data-id="${car.id}">Delete</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");

    attachEventListeners();
  }

  function attachEventListeners() {
    // Edit buttons
    document.querySelectorAll(".edit-car").forEach((btn) => {
      btn.addEventListener("click", function () {
        const carId = this.dataset.id;
        window.location.href = `/host/add-car.html?id=${carId}`;
      });
    });

    // Delete buttons
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
        `http://localhost:8080/api/host/cars/${carId}`,
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
