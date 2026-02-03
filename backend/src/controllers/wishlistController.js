const Wishlist = require("../models/Wishlist");
const Car = require("../models/Car");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          as: "car",
          include: [
            {
              model: User,
              as: "host",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["addedAt", "DESC"]],
    });

    return successResponse(
      res,
      wishlistItems,
      "Wishlist retrieved successfully",
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.id;

    if (!carId) {
      return errorResponse(res, "Car ID is required", 400);
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    const existingItem = await Wishlist.findOne({
      where: { userId, carId },
    });

    if (existingItem) {
      return errorResponse(res, "Car is already in wishlist", 400);
    }

    const wishlistItem = await Wishlist.create({
      userId,
      carId,
    });

    const itemWithCar = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Car,
          as: "car",
        },
      ],
    });

    return successResponse(res, itemWithCar, "Car added to wishlist", 201);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await Wishlist.findOne({
      where: { userId, carId },
    });

    if (!wishlistItem) {
      return errorResponse(res, "Car not found in wishlist", 404);
    }

    await wishlistItem.destroy();

    return successResponse(res, null, "Car removed from wishlist");
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
