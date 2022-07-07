const { query } = require("../db/connection");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/categories");

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

//   let queryStr = `SELECT reviews.*, COUNT(comments.review_id):: INT AS comment_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id `;
//   const queryValues = [];
//   if (sort_by) {
//     queryValues.push(sort_by);
//     queryValues.push(order);
//     queryStr += `ORDER BY $1, $2`;
//   }

//   return Promise.all([db.query(queryStr, queryValues)]).then(([rows]) => {
//     console.log(queryStr);
//     return rows;
//   });
// };

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
