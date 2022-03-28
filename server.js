const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const cors = require("cors");
const db = require("./db/db");
const profileRoute = require("./routes/profile/profile");
const authRoute = require("./routes/auth/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});
app.use("/", profileRoute);
app.use("/auth", authRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
