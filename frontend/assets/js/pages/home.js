import { getAllCars } from "../services/car.service.js";
import { showLoader, hideLoader } from "../ui/loader.js";

export const init = async () => {
  console.log("Home page loaded");
  const carContainer = document.getElementById("car-list");
  if (!carContainer) return;

  showLoader();
  try {
    const cars = await getAllCars();
    carContainer.innerHTML = cars
      .map(
        (c) => `
      <div class="car-card">
        <h3>${c.name}</h3>
        <p>${c.type}</p>
        <p>${c.pricePerDay} / day</p>
        <a href="/car-details.html?id=${c.id}">View</a>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error(err);
    carContainer.innerHTML = `<p class="error">Failed to load cars.</p>`;
  } finally {
    hideLoader();
  }
};
