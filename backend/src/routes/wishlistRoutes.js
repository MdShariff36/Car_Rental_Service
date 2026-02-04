const express = require("express");
const router = express.Router();
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, getUserWishlist);
router.post("/", authenticate, addToWishlist);
router.delete("/:carId", authenticate, removeFromWishlist);

module.exports = router;
