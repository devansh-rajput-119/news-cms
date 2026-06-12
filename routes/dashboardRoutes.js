const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

const {
  getDashboardStats
} = require("../controllers/dashboardController");

router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

module.exports = router;