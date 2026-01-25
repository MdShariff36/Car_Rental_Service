// FILE: frontend/assets/js/services/car.service.js
import { api } from "../core/api.js";

export const getAllCars = () => api("/cars");

export const getAvailableCars = () => api("/cars/available");

export const getCarById = (id) => api(`/cars/${id}`);

export const getCarsByType = (type) => api(`/cars/type/${type}`);

export const searchCars = (name) => api(`/cars/search?name=${name}`);

export const getCarsByPriceRange = (minPrice, maxPrice) =>
  api(`/cars/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);

export const addCar = (carData, ownerId) =>
  api(`/cars?ownerId=${ownerId}`, "POST", carData);

export const updateCar = (id, carData) => api(`/cars/${id}`, "PUT", carData);

export const deleteCar = (id) => api(`/cars/${id}`, "DELETE");
