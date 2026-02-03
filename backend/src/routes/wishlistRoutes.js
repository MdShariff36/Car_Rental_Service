const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, wishlistController.getWishlist);
router.post("/", authMiddleware, wishlistController.addToWishlist);
router.delete("/:carId", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
