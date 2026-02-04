const { Op } = require("sequelize");
const Car = require("../models/Car");
const User = require("../models/User");
const {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
} = require("../utils/response");

// GET /api/cars - Get all cars with filtering and pagination
const getAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const where = { status: "AVAILABLE" };

    if (category) where.category = category;
    if (minPrice)
      where.pricePerDay = { ...where.pricePerDay, [Op.gte]: minPrice };
    if (maxPrice)
      where.pricePerDay = { ...where.pricePerDay, [Op.lte]: maxPrice };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Car.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: require("../models/User"),
          as: "host",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return paginatedResponse(res, "Cars fetched successfully", rows, {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Get cars error:", error);
    return errorResponse(res, "Failed to fetch cars", 500);
  }
};

// GET /api/cars/:id - Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, {
      include: [
        {
          model: require("../models/User"),
          as: "host",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: require("../models/Review"),
          as: "reviews",
          include: [
            {
              model: require("../models/User"),
              as: "user",
              attributes: ["name", "avatar"],
            },
          ],
        },
      ],
    });

    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    return successResponse(res, "Car fetched successfully", car);
  } catch (error) {
    console.error("Get car error:", error);
    return errorResponse(res, "Failed to fetch car", 500);
  }
};

// POST /api/cars - Create car (Host only)
const createCar = async (req, res) => {
  try {
    const carData = { ...req.body, hostId: req.userId };
    const car = await Car.create(carData);
    return createdResponse(res, "Car created successfully", car);
  } catch (error) {
    console.error("Create car error:", error);
    return errorResponse(res, "Failed to create car", 500);
  }
};

// PUT /api/cars/:id - Update car (Host only)
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    if (car.hostId !== req.userId && req.userRole !== "ADMIN") {
      return errorResponse(res, "Not authorized to update this car", 403);
    }

    await car.update(req.body);
    return successResponse(res, "Car updated successfully", car);
  } catch (error) {
    console.error("Update car error:", error);
    return errorResponse(res, "Failed to update car", 500);
  }
};

// DELETE /api/cars/:id - Delete car (Host only)
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    if (car.hostId !== req.userId && req.userRole !== "ADMIN") {
      return errorResponse(res, "Not authorized to delete this car", 403);
    }

    await car.destroy();
    return successResponse(res, "Car deleted successfully");
  } catch (error) {
    console.error("Delete car error:", error);
    return errorResponse(res, "Failed to delete car", 500);
  }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar };
