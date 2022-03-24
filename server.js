const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const db = require("./db/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/home/index", { data: ["hello", "world"] });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
