const {
  fetchCategories,
  fetchReviewsById,
  fetchReviewVotes,
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
  // if (Number(review_id) === NaN) {
  //   next(err);
  // } else {
  fetchReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
  // }
};

// exports.updateReview = (req, res, next) => {
//   console.log(req.params);
//   const { review_id } = req.params;
//   const { inc_votes } = req.body;
//   console.log(review_id, inc_votes);
//   fetchReviewVotes(review_id, inc_votes)
//     .then((review) => {
//       res.status(200).send({ review });
//     })
//     .catch(next);
// };
