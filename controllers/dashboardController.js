const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
    try {

        const totalArticles = await Article.countDocuments();

        const publishedArticles =
            await Article.countDocuments({
                status: "published"
            });

        const draftArticles =
            await Article.countDocuments({
                status: "draft"
            });

        const totalCategories =
            await Category.countDocuments();

        const totalUsers =
            await User.countDocuments();

        const recentArticles = await Article.find()
            .populate("author", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalArticles,
            publishedArticles,
            draftArticles,
            totalCategories,
            totalUsers,
            recentArticles
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};