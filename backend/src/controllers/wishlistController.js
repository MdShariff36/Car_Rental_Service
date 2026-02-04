const Wishlist = require("../models/Wishlist");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");

// GET /api/wishlist - Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.userId },
      include: [{ model: require("../models/Car"), as: "car" }],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Wishlist fetched successfully", wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse(res, "Failed to fetch wishlist", 500);
  }
};

// POST /api/wishlist - Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { carId } = req.body;

    const existing = await Wishlist.findOne({
      where: { userId: req.userId, carId },
    });

    if (existing) {
      return errorResponse(res, "Car already in wishlist", 400);
    }

    const wishlist = await Wishlist.create({
      userId: req.userId,
      carId,
    });

    return createdResponse(res, "Added to wishlist", wishlist);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return errorResponse(res, "Failed to add to wishlist", 500);
  }
};

// DELETE /api/wishlist/:carId - Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: { userId: req.userId, carId: req.params.carId },
    });

    if (!wishlist) {
      return errorResponse(res, "Item not in wishlist", 404);
    }

    await wishlist.destroy();
    return successResponse(res, "Removed from wishlist");
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse(res, "Failed to remove from wishlist", 500);
  }
};

module.exports = { getUserWishlist, addToWishlist, removeFromWishlist };
