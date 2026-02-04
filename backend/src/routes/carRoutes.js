const express = require("express");
const router = express.Router();
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { authenticate, optionalAuth } = require("../middleware/authMiddleware");
const { hostOrAdmin } = require("../middleware/roleMiddleware");

router.get("/", optionalAuth, getAllCars);
router.get("/:id", getCarById);
router.post("/", authenticate, hostOrAdmin, createCar);
router.put("/:id", authenticate, hostOrAdmin, updateCar);
router.delete("/:id", authenticate, hostOrAdmin, deleteCar);

module.exports = router;
