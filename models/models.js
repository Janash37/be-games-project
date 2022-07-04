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
      // if (!review) {
      //   return Promise.reject({
      //     status: 400,
      //     msg: "PSQL error, invalid input",
      //   });
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid path and/or data type!",
        });
      } else {
        return review.rows;
      }
    });
};

exports.fetchReviewVotes = () => {};
