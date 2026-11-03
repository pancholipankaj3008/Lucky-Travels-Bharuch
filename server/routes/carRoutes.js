const express = require("express");
const router = express.Router();

const {
  addCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const protectAdmin = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getAllCars);
router.get("/:id", getSingleCar);

// Admin protected routes
router.post("/", protectAdmin, upload.single("image"), addCar);
router.put("/:id", protectAdmin, upload.single("image"), updateCar);
router.delete("/:id", protectAdmin, deleteCar);

module.exports = router;