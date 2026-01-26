import { api } from "../core/api.js";
import { ENDPOINTS } from "../base/config.js";

/**
 * Get all available cars
 */
export const getAllCars = async () => {
  try {
    return await api(ENDPOINTS.CARS, "GET", null, false);
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};

/**
 * Get car by ID
 */
export const getCarById = async (id) => {
  try {
    return await api(`/cars/${id}`, "GET", null, false);
  } catch (error) {
    console.error("Error fetching car:", error);
    throw error;
  }
};

/**
 * Get available cars only
 */
export const getAvailableCars = async () => {
  try {
    return await api(ENDPOINTS.CARS_AVAILABLE, "GET", null, false);
  } catch (error) {
    console.error("Error fetching available cars:", error);
    throw error;
  }
};

/**
 * Search cars by name
 */
export const searchCars = async (searchTerm) => {
  try {
    return await api(
      `${ENDPOINTS.CARS_SEARCH}?name=${searchTerm}`,
      "GET",
      null,
      false,
    );
  } catch (error) {
    console.error("Error searching cars:", error);
    throw error;
  }
};
