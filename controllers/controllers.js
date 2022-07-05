const {
  fetchCategories,
  fetchReviewsById,
  patchReviewVotes,
} = require("../models/models");

exports.getCategories = (req, res) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.updateReview = (req, res, next) => {
  const { review_d } = req.params;
  const { inc_votes } = req.body;
  patchReviewVotes(review_d, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
