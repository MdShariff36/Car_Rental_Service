import { api } from "../core/api.js";

export const getAllCars = () => api("/cars");
export const getCarById = (id) => api(`/cars/${id}`);
