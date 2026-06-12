const Article = require("../models/Article");
const slugify = require("slugify");

exports.createArticle = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    const article = await Article.create({
      title,
      slug: slugify(title, { lower: true }),
      content,
      category,
      status,
      readingTime,
      author: req.user.id,
      featuredImage
    });

    res.status(201).json(article);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getArticles = async (req, res) => {
  try {

    const articles = await Article.find()
      .populate("category", "name")
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(articles);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getSingleArticle = async (req, res) => {
  try {

    const article = await Article.findOneAndUpdate(
      {
        slug: req.params.slug
      },
      {
        $inc: { views: 1 }
      },
      {
        new: true
      }
    ).populate("category", "name");

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    res.json(article);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


exports.updateArticle = async (req, res) => {
  try {

    const existingArticle = await Article.findById(req.params.id);

if (!existingArticle) {
  return res.status(404).json({
    message: "Article not found"
  });
}

if (
  existingArticle.author.toString() !== req.user.id &&
  req.user.role !== "admin"
) {
  return res.status(403).json({
    message: "Not allowed to edit this article"
  });
}

const {
  title,
  content,
  category,
  status,
  featuredImage
} = req.body;

    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug: slugify(title, { lower: true }),
        content,
        category,
        status,
        readingTime,
        featuredImage
      },
      {
        new: true
      }
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    res.json(article);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    if (
      article.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to delete this article"
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({
      message: "Article deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.searchArticles = async (req, res) => {
  try {

    const keyword = req.query.keyword;

    const articles = await Article.find({
      title: {
        $regex: keyword,
        $options: "i"
      }
    });

    res.json(articles);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};