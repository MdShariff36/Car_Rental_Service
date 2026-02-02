// FILE: assets/js/dashboards/host/add-car.js

document.addEventListener("DOMContentLoaded", function () {
  const carForm = document.getElementById("carForm");
  const submitBtn = carForm.querySelector(".submit-btn");

  // Get car ID from URL for editing
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  if (carId) {
    loadCarData(carId);
  }

  carForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(carForm);
    const carData = {
      name: formData.get("name"),
      category: formData.get("category"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      year: parseInt(formData.get("year")),
      pricePerDay: parseFloat(formData.get("pricePerDay")),
      seats: parseInt(formData.get("seats")),
      transmission: formData.get("transmission"),
      fuelType: formData.get("fuelType"),
      luggage: parseInt(formData.get("luggage")),
      description: formData.get("description"),
      features: formData.get("features")
        ? formData
            .get("features")
            .split(",")
            .map((f) => f.trim())
        : [],
    };

    // Validation
    if (!carData.name || !carData.category || !carData.pricePerDay) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setLoadingState(true);

    try {
      const token = AuthService.getToken();
      const url = carId
        ? `http://localhost:8080/api/host/cars/${carId}`
        : "http://localhost:8080/api/host/cars";

      const method = carId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save car");
      }

      const message = carId
        ? "Car updated successfully"
        : "Car added successfully";
      showNotification(message, "success");

      setTimeout(() => {
        window.location.href = "/host/manage-cars.html";
      }, 1500);
    } catch (error) {
      console.error("Save car error:", error);
      showNotification(error.message || "Failed to save car", "error");
    } finally {
      setLoadingState(false);
    }
  });

  async function loadCarData(id) {
    showLoader();
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `http://localhost:8080/api/host/cars/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load car data");
      }

      const car = await response.json();
      populateForm(car);
    } catch (error) {
      console.error("Load car error:", error);
      showNotification("Failed to load car data", "error");
    } finally {
      hideLoader();
    }
  }

  function populateForm(car) {
    document.getElementById("name").value = car.name || "";
    document.getElementById("category").value = car.category || "";
    document.getElementById("brand").value = car.brand || "";
    document.getElementById("model").value = car.model || "";
    document.getElementById("year").value = car.year || "";
    document.getElementById("pricePerDay").value = car.pricePerDay || "";
    document.getElementById("seats").value = car.seats || "";
    document.getElementById("transmission").value = car.transmission || "";
    document.getElementById("fuelType").value = car.fuelType || "";
    document.getElementById("luggage").value = car.luggage || "";
    document.getElementById("description").value = car.description || "";

    if (car.features && Array.isArray(car.features)) {
      document.getElementById("features").value = car.features.join(", ");
    }
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Saving...</span>';
    } else {
      submitBtn.disabled = false;
      const text = carId ? "Update Car" : "Add Car";
      submitBtn.innerHTML = `<span class="btn-text">${text}</span>`;
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
