import { api } from "../core/api.js";

export const addCar = (c) =>
  api("/host/cars", { method: "POST", body: JSON.stringify(c) });

export const myCars = () => api("/host/cars");
