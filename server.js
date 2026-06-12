const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const dashboardRoutes = require("./routes/dashboardRoutes");
const viewRoutes = require("./routes/viewRoutes");
const session = require("express-session");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const articleRoutes = require("./routes/articleRoutes");


const app = express();

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "newscmssecret",
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {

    res.locals.user =
        req.session.user || null;

    next();

});

app.set(
  "views",
  path.join(__dirname, "views")
);

app.use(expressLayouts);

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// DB connect
connectDB();

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/articles", articleRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/", viewRoutes);

const { protect } = require("./middlewares/authMiddleware");

const middleware = require("./middlewares/authMiddleware");

console.log(middleware);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route 🔥",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});