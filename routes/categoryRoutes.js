const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");


router.post("/", protect, adminOnly, createCategory);

router.put("/:id", protect, adminOnly, updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);

router.get("/", getCategories);

module.exports = router;