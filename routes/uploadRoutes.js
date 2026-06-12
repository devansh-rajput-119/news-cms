const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

router.post(
  "/",
  protect,
  upload.single("image"),
  (req, res) => {

    res.json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`
    });

  }
);

module.exports = router;