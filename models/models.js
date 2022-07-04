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
          status: 400,
          msg: "Invalid query!",
        });
      } else {
        return review.rows;
      }
    });
};
