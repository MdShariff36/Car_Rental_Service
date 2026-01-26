import { getAllCars } from "../services/car.service.js";

export const init = async () => {
  console.log("Home page loaded");

  // Load popular cars section
  await loadPopularCars();

  // Newsletter form handler
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletter);
  }
};

async function loadPopularCars() {
  const carContainer = document.querySelector(".grid.grid-3");

  if (!carContainer) return;

  try {
    // Show loading state
    carContainer.innerHTML =
      '<p style="text-align: center; grid-column: 1/-1;">Loading cars...</p>';

    // Fetch cars from backend
    const cars = await getAllCars();

    if (!cars || cars.length === 0) {
      carContainer.innerHTML =
        '<p style="text-align: center; grid-column: 1/-1;">No cars available at the moment.</p>';
      return;
    }

    // Display first 3 cars as "Popular"
    const popularCars = cars.slice(0, 3);

    carContainer.innerHTML = popularCars
      .map(
        (car, index) => `
      <article class="car-card ${index === 0 ? "premium" : ""}">
        ${index === 0 ? '<span class="car-badge">Popular</span>' : ""}
        <img 
          src="${car.images && car.images[0] ? car.images[0] : "assets/images/placeholder.jpg"}" 
          alt="${car.name}"
          onerror="this.src='assets/images/placeholder.jpg'"
        />
        <div style="padding: 14px">
          <h3>${car.name}</h3>
          <p class="muted">${car.type} • ${car.transmission} • ${car.seats} Seats</p>
          <div class="card-row">
            <span class="price">₹${car.pricePerDay}/day</span>
            <a class="btn btn-sm" href="car-details.html?id=${car.id}">Book</a>
          </div>
        </div>
      </article>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading cars:", error);
    carContainer.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; color: #ef4444;">
        <p>⚠️ Failed to load cars. Please make sure the backend is running.</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">${error.message}</p>
      </div>
    `;
  }
}

function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with: ${email}`);
  e.target.reset();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
