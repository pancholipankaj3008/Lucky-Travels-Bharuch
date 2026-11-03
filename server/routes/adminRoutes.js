const express = require("express");
const router = express.Router();

const {
  adminLogin,
  refreshAccessToken,
  adminLogout,
  getAdminSession,
} = require("../controllers/adminController");
const protectAdmin = require("../middleware/authMiddleware");

router.post("/login", adminLogin);

router.post("/refresh", refreshAccessToken);

router.post("/logout", adminLogout);
router.get("/me", protectAdmin, getAdminSession);

module.exports = router;
