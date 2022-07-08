const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handlePSQLErrors,
  handle500s,
} = require("./errors/errors");

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

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

//MODULE EXPORTS

module.exports = app;
