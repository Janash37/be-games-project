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

exports.fetchAllUsers = (users) => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: username not found",
        });
      } else {
        return user.rows;
      }
    });
};

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  console.log(sort_by, order, category);
  const validColumns = [
    "title",
    "owner",
    "created_at",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "comment_count",
  ];
  const validCategories = [
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
    "euro game",
    "social deduction",
  ];
  const validOrders = ["asc", "desc"];

  if (!validColumns.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "400: invalid input" });
  }

  let queryStr = `SELECT title, owner, reviews.created_at, reviews.review_body, designer, review_img_url, reviews.votes, reviews.category, COUNT(comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  const categoryValue = [];
  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({ status: 404, msg: "404: category not found" });
    } else {
      queryStr += ` WHERE category = $1`;
      categoryValue.push(category);
    }
  }
  queryStr += ` GROUP BY reviews.review_id`;

  const orderVariable = ` ORDER BY ${sort_by} ` + order + ";";
  queryStr += orderVariable;
  console.log(queryStr);
  return db.query(queryStr, categoryValue).then((reviews) => {
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

exports.patchCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: comment not found",
        });
      } else {
        const selectedComment = comment.rows[0];
        selectedComment.votes += Number(inc_votes);
        return selectedComment;
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

exports.postNewReview = (newReview) => {
  const { owner, title, review_body, designer, category } = newReview;

  if (!owner || !review_body || !title || !designer || !category) {
    return Promise.reject({
      status: 400,
      msg: "400: missing input value",
    });
  }

  return db
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [owner, title, review_body, designer, category]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeComment = (comment_id) => {
  const queryValues = [];

  if (comment_id) {
    queryValues.push(comment_id);
  }

  return Promise.all([
    db
      .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
      .then(({ rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 404, msg: "404: comment not found" });
        } else {
          db.query(
            `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`,
            queryValues
          ).then(() => {
            return;
          });
        }
      }),
  ]);
};

exports.fetchAllEndpoints = () => {
  const endpointsFile = fs.readFileSync("./endpoints.json");
  const parsed = JSON.parse(endpointsFile);
  return parsed;
};

//BELOW: DOES THE REVIEW EXIST?

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
