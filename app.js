const express = require("express");
const app = express();
app.use(express.json());

const {
  getCategories,
  getReviewsById,
  updateReview,
} = require("./controllers/controllers");

//ENDPOINT MIDDLEWARE BELOW

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewsById);
// app.patch("/api/reviews/:review_d", updateReview);

//ERROR-HANDLING MIDDLEWARE BELOW

app.all("/*", (req, res) => {
  res.status(400).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

//MODULE EXPORTS

module.exports = app;
