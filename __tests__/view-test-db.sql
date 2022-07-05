\c nc_games_test

SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;