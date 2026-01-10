import { api } from "../core/api.js";

export const getCars = () => api("/cars");
export const getCar = (id) => api(`/cars/${id}`);
