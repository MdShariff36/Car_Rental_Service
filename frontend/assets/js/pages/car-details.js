import { CarService } from "../services/car.service.js";
import { Storage } from "../base/storage.js";

const id = new URLSearchParams(location.search).get("id");
const car = CarService.getById(id);

document.getElementById("carName").innerText = car.name;

document.getElementById("bookBtn").onclick = () => {
  Storage.set("selectedCar", car);
  window.location.href = "booking.html";
};
