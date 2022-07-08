const express = require("express");
const app = express();
app.use(express.json());

const {
  getAllEndpoints,
  getReviews,
  getReviewsById,
  getReviewComments,
  getCategories,
  getAllUsers,
  getUser,
  updateReview,
  addNewReview,
  updateCommentVotes,
  addNewComment,
  deleteComment,
} = require("./controllers/controllers");

//ENDPOINT MIDDLEWARE BELOW

app.get("/api", getAllEndpoints);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getReviewComments);
app.get("/api/categories", getCategories);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUser);

app.patch("/api/reviews/:review_id", updateReview);
app.patch("/api/comments/:comment_id", updateCommentVotes);

app.post("/api/reviews/:review_id/comments", addNewComment);
app.post("/api/reviews", addNewReview);

app.delete("/api/comments/:comment_id", deleteComment);

//ERROR-HANDLING MIDDLEWARE BELOW

app.all("/*", (req, res) => {
  res.status(400).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<< inside PSQL error handler");
  if (err.code === "22P02" || err.code === "42601") {
    res.status(400).send({ msg: "400: invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "404: path not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err, "<<< inside custom error handler");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
    console.log(err.msg);
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err, "<<< inside 500 error handler");
  res.status(500).send({ msg: "Internal server error" });
});

//MODULE EXPORTS

module.exports = app;
