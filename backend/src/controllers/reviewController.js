const Review = require("../models/Review");
const Car = require("../models/Car");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findByPk(carId);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    const reviews = await Review.findAll({
      where: { carId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return successResponse(
      res,
      {
        reviews,
        averageRating: averageRating.toFixed(1),
        totalReviews: reviews.length,
      },
      "Reviews retrieved successfully",
    );
  } catch (error) {
    console.error("Get car reviews error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!carId || !rating) {
      return errorResponse(res, "Car ID and rating are required", 400);
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, "Rating must be between 1 and 5", 400);
    }

    const car = await Car.findByPk(carId);
    if (!car) {
      return errorResponse(res, "Car not found", 404);
    }

    const existingReview = await Review.findOne({
      where: { userId, carId },
    });

    if (existingReview) {
      return errorResponse(res, "You have already reviewed this car", 400);
    }

    const review = await Review.create({
      userId,
      carId,
      rating,
      comment,
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
      ],
    });

    return successResponse(
      res,
      reviewWithUser,
      "Review created successfully",
      201,
    );
  } catch (error) {
    console.error("Create review error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getCarReviews,
  createReview,
};
