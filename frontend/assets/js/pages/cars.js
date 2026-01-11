import { CarService } from "../services/car.service.js";

const list = document.getElementById("carList");

CarService.getAll().forEach((car) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${car.name}</h3>
    <p>₹${car.price}/day</p>
    <button data-id="${car.id}">View</button>
  `;

  div.querySelector("button").onclick = () => {
    window.location.href = `car-details.html?id=${car.id}`;
  };

  list.appendChild(div);
});
