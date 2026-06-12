const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  createArticle,
  getArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  searchArticles
} = require("../controllers/articleController");

router.post("/", protect, createArticle);

router.get("/", getArticles);

router.get("/search/query", searchArticles);

router.get("/:slug", getSingleArticle);

router.put("/:id", protect, updateArticle);

router.delete("/:id", protect, deleteArticle);

module.exports = router;