const express = require("express");
const router = express.Router();
const {
  getCarReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticate, optionalAuth } = require("../middleware/authMiddleware");

router.get("/car/:carId", optionalAuth, getCarReviews);
router.post("/", authenticate, createReview);
router.delete("/:id", authenticate, deleteReview);

module.exports = router;
