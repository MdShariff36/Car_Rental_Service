const express = require("express");
const router = express.Router();
const hostController = require("../controllers/hostController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.getHostDashboard,
);
router.get(
  "/cars",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.getHostCars,
);
router.post(
  "/cars",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.createHostCar,
);
router.get(
  "/cars/:id",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.getHostCarById,
);
router.put(
  "/cars/:id",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.updateHostCar,
);
router.delete(
  "/cars/:id",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.deleteHostCar,
);
router.get(
  "/earnings",
  authMiddleware,
  roleMiddleware("HOST", "ADMIN"),
  hostController.getHostEarnings,
);

module.exports = router;
