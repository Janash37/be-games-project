const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviewsById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: path not found",
        });
      } else {
        return review.rows;
      }
    });
};

exports.fetchReviewVotes = (review_id, inc_votes) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: path not found",
        });
      } else {
        const selectedReview = review.rows[0];
        selectedReview.votes += Number(inc_votes);
        return selectedReview;
      }
    });
};
