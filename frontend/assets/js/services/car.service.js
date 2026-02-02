/**
 * Car Service - Handles all car-related backend operations
 * NO DOM manipulation - only data fetching
 */

const CarService = (() => {
  /**
   * Get all cars
   * GET /api/cars
   */
  const getAllCars = async () => {
    try {
      const cars = await API.get("/cars");
      return { success: true, data: cars };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Get car by ID
   * GET /api/cars/{id}
   */
  const getCarById = async (carId) => {
    try {
      const car = await API.get(`/cars/${carId}`);
      return { success: true, data: car };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  /**
   * Search cars with filters
   * GET /api/cars?type=SUV&minPrice=20000
   */
  const searchCars = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/cars?${queryParams}` : "/cars";
      const cars = await API.get(endpoint);
      return { success: true, data: cars };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }
  };

  // Public API
  return {
    getAllCars,
    getCarById,
    searchCars,
  };
})();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CarService;
}
