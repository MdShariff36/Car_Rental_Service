const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/login", authLimiter, adminController.adminLogin);
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAdminDashboard,
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllUsers,
);
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.deleteUser,
);

router.get(
  "/cars",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllCarsAdmin,
);
router.post(
  "/cars",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.createCarAdmin,
);
router.put(
  "/cars/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.updateCarAdmin,
);
router.delete(
  "/cars/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.deleteCarAdmin,
);

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllBookingsAdmin,
);
router.put(
  "/bookings/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.updateBookingAdmin,
);

router.get(
  "/reports",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAdminReports,
);

router.get(
  "/settings",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAdminSettings,
);
router.put(
  "/settings",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.updateAdminSettings,
);

module.exports = router;
