const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviewsById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [review_id]
    )
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

exports.fetchUsers = (users) => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.fetchReviewComments = (review_id) => {
  const queryValues = [];
  let queryStr = `SELECT * FROM comments`;

  if (review_id) {
    queryStr += `WHERE review_id = $1`;
    queryValues.push(review_id);
  }

  return Promise.all([
    db.query(queryStr, queryValues),
    this.checkReviewExists(review_id),
  ]).then(([{ rows }]) => {
    return rows;
  });
  // return db
  //   .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
  //   .then((comments) => {
  //     console.log(comments.rows);
  //     return comments.rows;
  //   });
};

exports.patchReviewVotes = (review_id, inc_votes) => {
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

//FUNCTION: DOES THE REVIEW EXIST?

exports.checkReviewExists = (review_id) => {
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1`;
  if (!review_id) return;
  return db.query(queryStr, [review_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "404: review not found" });
    }
  });
};
