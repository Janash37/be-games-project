const db = require("../db/connection");
const fs = require("fs");

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

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

exports.fetchReviewComments = (review_id) => {
  const queryValues = [];

  if (review_id) {
    queryValues.push(review_id);
  }

  return Promise.all([
    db.query(`SELECT * FROM comments WHERE review_id = $1;`, queryValues),
    this.checkReviewExists(review_id),
  ]).then(([{ rows }]) => {
    return rows;
  });
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

exports.postNewComment = (review_id, newComment) => {
  const { username, body } = newComment;

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "400: missing input value",
    });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, review_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchAllEndpoints = () => {
  const endpointsFile = fs.readFileSync("./endpoints.json");
  const parsed = JSON.parse(endpointsFile);
  return parsed;
};

//FUNCTION: DOES THE REVIEW EXIST?

exports.checkReviewExists = (review_id) => {
  if (!review_id) return;

  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404: review not found" });
      }
    });
};
