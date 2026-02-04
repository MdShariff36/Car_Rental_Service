const express = require("express");
const router = express.Router();
const {
  getHostDashboard,
  getHostCars,
  getHostEarnings,
} = require("../controllers/hostController");
const { authenticate } = require("../middleware/authMiddleware");
const { hostOrAdmin } = require("../middleware/roleMiddleware");

router.get("/dashboard", authenticate, hostOrAdmin, getHostDashboard);
router.get("/cars", authenticate, hostOrAdmin, getHostCars);
router.get("/earnings", authenticate, hostOrAdmin, getHostEarnings);

module.exports = router;
