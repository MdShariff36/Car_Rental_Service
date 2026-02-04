const Review = require("../models/Review");
const Car = require("../models/Car");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");

// GET /api/reviews/car/:carId - Get car reviews
const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { carId: req.params.carId },
      include: [
        {
          model: require("../models/User"),
          as: "user",
          attributes: ["name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Reviews fetched successfully", reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    return errorResponse(res, "Failed to fetch reviews", 500);
  }
};

// POST /api/reviews - Create review
const createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.userId,
      carId,
      rating,
      comment,
    });

    // Update car rating
    const car = await Car.findByPk(carId);
    const reviews = await Review.findAll({ where: { carId } });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    car.rating = avgRating.toFixed(2);
    car.totalReviews = reviews.length;
    await car.save();

    return createdResponse(res, "Review created successfully", review);
  } catch (error) {
    console.error("Create review error:", error);
    return errorResponse(res, "Failed to create review", 500);
  }
};

// DELETE /api/reviews/:id - Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    if (review.userId !== req.userId && req.userRole !== "ADMIN") {
      return errorResponse(res, "Not authorized", 403);
    }

    await review.destroy();
    return successResponse(res, "Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return errorResponse(res, "Failed to delete review", 500);
  }
};

module.exports = { getCarReviews, createReview, deleteReview };
