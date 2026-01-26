import { getAllCars } from "../services/car.service.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadCars();
});

async function loadCars() {
  const carGrid = document.querySelector(".car-grid");

  if (!carGrid) {
    console.error("Car grid container not found");
    return;
  }

  try {
    // Show loading
    carGrid.innerHTML =
      '<p style="text-align: center; padding: 40px;">Loading cars...</p>';

    // Fetch from backend
    const cars = await getAllCars();

    if (!cars || cars.length === 0) {
      carGrid.innerHTML =
        '<p style="text-align: center; padding: 40px;">No cars available</p>';
      return;
    }

    // Render cars
    carGrid.innerHTML = cars
      .map(
        (car) => `
      <div class="car-card">
        <img 
          src="${car.images && car.images[0] ? car.images[0] : "assets/images/placeholder.jpg"}" 
          alt="${car.name}"
          onerror="this.src='assets/images/placeholder.jpg'"
        />
        <div class="car-info">
          <h3>${car.name}</h3>
          <div class="car-tags">
            <span>${car.type}</span>
            <span>${car.transmission}</span>
            <span>${car.seats} Seats</span>
          </div>
          <div class="car-price">₹${car.pricePerDay} <small>/ day</small></div>
          <a href="car-details.html?id=${car.id}" class="btn">Book Now</a>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading cars:", error);
    carGrid.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ef4444;">
        <p>⚠️ Failed to load cars</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">${error.message}</p>
      </div>
    `;
  }
}
