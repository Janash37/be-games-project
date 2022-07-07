const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("/api", () => {
  describe("GET /api/categories", () => {
    test("returns status 200 when a successful get request is made", () => {
      return request(app).get("/api/categories").expect(200);
    });
    test("returns status 200 and an array of category objects, with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toHaveLength(4);
          body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    test("returns status 200 when a successful get request is made", () => {
      return request(app).get("/api/reviews/1").expect(200);
    });
    test("returns status 200 and a review object, with review_id, title, review_body, designer, review_img_url, votes, category, owner and created_at properties", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toHaveLength(1);
          body.review.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: expect.any(String),
                votes: 1,
              })
            );
          });
        });
    });
    test("returns status 404 when the path is not found", () => {
      return request(app)
        .get("/api/reviews/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: path not found");
        });
    });
    test("returns status 400 when a bad request is made", () => {
      return request(app)
        .get("/api/reviews/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: invalid input");
        });
    });
    test("returns status 200 and a review object which also includes a comment_count property", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toHaveLength(1);
          body.review.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: 2,
                title: "Jenga",
                designer: "Leslie Scott",
                owner: "philippaclaire9",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                category: "dexterity",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                comment_count: 3,
              })
            );
          });
        });
    });
    test("returns status 200 even when there are no comments for a review_id", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toHaveLength(1);
          body.review.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: 1,
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: expect.any(String),
                votes: 1,
                comment_count: 0,
              })
            );
          });
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    test("returns status 200 when a successful patch request is made (positive increment)", () => {
      const updateReview = { inc_votes: 1 };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateReview)
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          const updatedReview = body.review;
          expect(updatedReview).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 2,
          });
        });
    });
    test("returns status 200 when a successful patch request is made (decrement)", () => {
      const updateReview = { inc_votes: -50 };

      return request(app)
        .patch("/api/reviews/1")
        .send(updateReview)
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          const updatedReview = body.review;
          expect(updatedReview).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: -49,
          });
        });
    });
    test("returns status 404 when the path is not found", () => {
      return request(app)
        .patch("/api/reviews/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: path not found");
        });
    });
    test("returns status 400 when a bad request is made", () => {
      return request(app)
        .patch("/api/reviews/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: invalid input");
        });
    });
  });
  describe("GET /api/users", () => {
    test("returns status 200 when a successful get request is made", () => {
      return request(app).get("/api/users").expect(200);
    });
    test("returns status 200 and an array of user objects, with username, name and avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/reviews", () => {
    test("returns status 200 when a successful get request is made", () => {
      return request(app).get("/api/reviews").expect(200);
    });
    test("returns status 200 and an array of review objects, each with owner, title, review_id, category, review_img_url, created_at, votes, review_body, designer and comment count properties", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toHaveLength(13);
          body.reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("returns status 200 and an array of reviews sorted by date by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("returns status 200 and an array of reviews sorted by the given input (default sort order)", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner")
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(reviews).toBeSortedBy("owner", {
            descending: true,
          });
        });
    });
    test("returns status 200 and an array of reviews in ascending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&order=asc")
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(reviews).toBeSortedBy("title", {
            ascending: true,
            coerce: true,
          });
        });
    });
    test("returns status 200 and an array of reviews after being filtered by category", () => {
      return request(app)
        .get("/api/reviews?sort_by=designer&category=dexterity")
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(reviews).toBeSortedBy("review_id", {
            ascending: true,
            coerce: true,
          });
        });
    });
    test("returns status 200 and an array of reviews after being sorted and filtered by category", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner&order=asc&category=social deduction")
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(reviews).toBeSortedBy("owner", {
            ascending: true,
            coerce: true,
          });
        });
    });
    test("returns status 400 when given an invalid input", () => {
      return request(app)
        .get("/api/reviews?sort_by=weight")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("400: invalid input");
        });
    });
    test("returns status 400 when given an invalid order query", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&order=none")
        .expect(400)
        .then((result) => {
          expect(result.body.msg).toBe("400: invalid input");
        });
    });
    test("returns status 404 when given a bad category query", () => {
      return request(app)
        .get("/api/reviews?sort_by=owner&category=cheese")
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe("404: category not found");
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    test("returns status 201 when a successful post request is made", () => {
      const newComment = {
        username: "bainesface",
        body: "This is the greatest game ever made",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const updatedReview = body.comment;
          expect(updatedReview).toEqual({
            review_id: 1,
            body: "This is the greatest game ever made",
            author: "bainesface",
            created_at: expect.any(String),
            votes: 0,
            comment_id: 7,
          });
        });
    });
    test("returns status 201 and responds with the posted comment, which is an object", () => {
      const newComment = {
        username: "bainesface",
        body: "This is the greatest game ever made",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const updatedReview = body.comment;
          expect(updatedReview).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_id: expect.any(Number),
            })
          );
        });
    });
    test("returns status 404 when the path is not found", () => {
      const newComment = {
        username: "bainesface",
        body: "This is the greatest game ever made",
      };
      return request(app)
        .post("/api/reviews/1000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: path not found");
        });
    });
    test("returns status 404 when the given username is not found", () => {
      const newComment = {
        username: "doug",
        body: "This is the greatest game ever made",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: path not found");
        });
    });
    test("returns status 400 when a bad request or invalid id is made", () => {
      const newComment = {
        username: "bainesface",
        body: "This is the greatest game ever made",
      };
      return request(app)
        .post("/api/reviews/two/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: invalid input");
        });
    });
    test("returns status 400 when a field is missing, e.g. no username or", () => {
      const newComment = {
        username: "bainesface",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: missing input value");
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    test("returns status 200 when a successful get request is made", () => {
      return request(app).get("/api/reviews/1/comments").expect(200);
    });
    test("returns status 200 and an array of comments for the given review_id, with comment_id, votes, created_at, author, body and review_id properties", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(3);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
              })
            );
          });
        });
    });
    test("returns status 404 when the path is not found", () => {
      return request(app)
        .get("/api/reviews/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: review not found");
        });
    });
    test("returns status 400 when a bad request is made", () => {
      return request(app)
        .get("/api/reviews/bananas/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: invalid input");
        });
    });
  });
});
