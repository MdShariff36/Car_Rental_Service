const Car = require("../models/Car");
const User = require("../models/User");
const Review = require("../models/Review");
const { successResponse, errorResponse } = require("../utils/response");
const { Op } = require("sequelize");

const getAllCars = async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      fuel,
      transmission,
      page = 1,
      limit = 12,
    } = req.query;

    const where = { status: "available" };

    if (type) {
      where.category = type;
    }

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay[Op.lte] = parseFloat(maxPrice);
    }

    if (fuel) {
      where.fuelType = fuel;
    }

    if (transmission) {
      where.transmission = transmission;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: cars } = await Car.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      {
        cars,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        totalCars: count,
      },
      "Cars retrieved successfully",
    );
  } catch (error) {
    console.error("Get all cars error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id, {
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "email", "phone", "avatar"],
        },
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "avatar"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    const reviews = car.reviews || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    const carData = {
      ...car.toJSON(),
      averageRating: averageRating.toFixed(1),
      reviewCount: reviews.length,
    };

    return successResponse(res, carData, "Car retrieved successfully");
  } catch (error) {
    console.error("Get car by ID error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAllCars,
  getCarById,
};
