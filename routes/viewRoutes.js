const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const upload = require("../middlewares/uploadMiddleware");
const bcrypt = require("bcryptjs");
const { isLoggedIn } =
require("../middlewares/sessionAuth");

router.get("/register", (req, res) => {

    res.render("auth/register", {
        title: "Register",
        layout: "layouts/layout"
    });

});

router.post("/register", async (req, res) => {

    const existingUser =
        await User.findOne({
            email: req.body.email
        });

    if (existingUser) {
        return res.send(
            "Email already registered"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            req.body.password,
            10
        );

    await User.create({

        name: req.body.name,

        email: req.body.email,

        password: hashedPassword,

        role: "author"

    });

    res.redirect("/login");

});

router.get("/login", (req, res) => {

    res.render("auth/login", {
        title: "Login",
        layout: "layouts/layout"
    });

});

router.post("/login", async (req, res) => {

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.send("User not found");
    }

    const isMatch =
        await bcrypt.compare(
            req.body.password,
            user.password
        );

    if (!isMatch) {
        return res.send("Wrong password");
    }

    req.session.user = {
        id: user._id,
        name: user.name,
        role: user.role
    };

    if (user.role === "admin") {

    return res.redirect("/dashboard");

}

return res.redirect("/author-dashboard");

});

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

router.get("/test", (req, res) => {

    res.render("test/index", {
        title: "Test Page",
        layout: "layouts/layout"
    });

});

router.get("/", async (req, res) => {

    const latestArticles = await Article.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(6);

    res.render("home/index", {
        title: "News CMS",
        layout: "layouts/layout",
        latestArticles
    });

});

const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");

router.get("/dashboard", isLoggedIn, async (req, res) => {

    const recentArticles = await Article.find()
        .sort({ createdAt: -1 })
        .limit(5);

    const topViewedArticles = await Article.find()
        .sort({ views: -1 })
        .limit(5);

    const latestCategories = await Category.find()
        .sort({ createdAt: -1 })
        .limit(5);

    const stats = {
        totalArticles: await Article.countDocuments(),

        publishedArticles:
            await Article.countDocuments({
                status: "published"
            }),

        draftArticles:
            await Article.countDocuments({
                status: "draft"
            }),

        totalCategories:
            await Category.countDocuments(),

        totalUsers:
            await User.countDocuments()
    };

    res.render("dashboard/index", {
        title: "Dashboard",
        layout: "layouts/layout",
        stats,
        recentArticles,
        topViewedArticles,
        latestCategories
    });

});

router.get("/author-dashboard", async (req, res) => {

    const totalArticles =
        await Article.countDocuments();

    const publishedArticles =
        await Article.countDocuments({
            status: "published"
        });

    const draftArticles =
        await Article.countDocuments({
            status: "draft"
        });

    const recentArticles =
        await Article.find()
            .sort({ createdAt: -1 })
            .limit(5);

    res.render("author/dashboard", {
        title: "Author Dashboard",
        layout: "layouts/layout",
        totalArticles,
        publishedArticles,
        draftArticles,
        recentArticles
    });

});

router.get("/categories", isLoggedIn, async (req, res) => {

    if (req.session.user.role !== "admin") {
    return res.send("Access Denied");
}

    const categories = await Category.find()
        .sort({ createdAt: -1 });

    res.render("categories/index", {
        title: "Categories",
        layout: "layouts/layout",
        categories
    });

});

router.post("/categories/create", async (req, res) => {

    const slugify = require("slugify");

    await Category.create({
        name: req.body.name,
        slug: slugify(req.body.name, {
            lower: true
        })
    });

    res.redirect("/categories");

});

router.get("/articles", isLoggedIn, async (req, res) => {

const search = req.query.search || "";

const page = parseInt(req.query.page) || 1;
const limit = 5;

const query = {
    title: {
        $regex: search,
        $options: "i"
    }
};

if (req.session.user.role === "author") {
    query.author = req.session.user.id;
}

const totalArticles =
    await Article.countDocuments(query);

const totalPages =
    Math.ceil(totalArticles / limit);

const articles = await Article.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

res.render("articles/index", {
    title: "Articles",
    layout: "layouts/layout",
    articles,
    search,
    page,
    totalPages
});

});

router.get("/articles/create", isLoggedIn, async (req, res) => {

    const categories =
        await Category.find();

    res.render("articles/create", {
        title: "Create Article",
        layout: "layouts/layout",
        categories
    });

});

router.post(
    "/articles/create",
    upload.single("featuredImage"),
    async (req, res) => {

        const words =
            req.body.content
                .trim()
                .split(/\s+/).length;

        const readingTime =
            Math.ceil(words / 200);

        await Article.create({

            title: req.body.title,

            slug: slugify(
                req.body.title,
                { lower: true }
            ),

            author: req.session.user.id,

            content: req.body.content,

            category: req.body.category,

            status: req.body.status,

            featuredImage: req.file
                ? "/uploads/" + req.file.filename
                : "",

            readingTime

        });

        res.redirect("/articles");

    });

router.get("/articles/edit/:id", isLoggedIn, async (req, res) => {

    const article = await Article.findById(req.params.id)
        .populate("category");

        if (
    req.session.user.role === "author" &&
    article.author.toString() !== req.session.user.id
) {
    return res.send("Access Denied");
}

    const categories = await Category.find();

    res.render("articles/edit", {
        title: "Edit Article",
        layout: "layouts/layout",
        article,
        categories
    });

});

router.post("/articles/edit/:id", async (req, res) => {

    const words = req.body.content
        .trim()
        .split(/\s+/).length;

    const readingTime = Math.ceil(words / 200);

    await Article.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            slug: slugify(req.body.title, {
                lower: true
            }),
            content: req.body.content,
            category: req.body.category,
            status: req.body.status,
            readingTime
        }
    );

    res.redirect("/articles");

});

router.post("/articles/delete/:id", isLoggedIn, async (req, res) => {

    const article =
        await Article.findById(req.params.id);

    if (!article) {
        return res.send("Article not found");
    }

    if (
        req.session.user.role === "author" &&
        article.author.toString() !== req.session.user.id
    ) {
        return res.send("Access Denied");
    }

    await Article.findByIdAndDelete(
        req.params.id
    );

    res.redirect("/articles");

});

router.get("/articles/:slug", async (req, res) => {

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
    ).populate("category");

    if (!article) {
        return res.send("Article not found");
    }

    res.render("articles/show", {
        title: article.title,
        layout: "layouts/layout",
        article
    });

});

router.get("/users", isLoggedIn, async (req, res) => {

    if (req.session.user.role !== "admin") {
        return res.send("Access Denied");
    }

    const users = await User.find()
        .sort({ createdAt: -1 });

    res.render("users/index", {
        title: "Users",
        layout: "layouts/layout",
        users
    });

});

router.post("/users/delete/:id", isLoggedIn, async (req, res) => {

    if (req.session.user.role !== "admin") {
        return res.send("Access Denied");
    }

    await User.findByIdAndDelete(req.params.id);

    res.redirect("/users");

});

module.exports = router;