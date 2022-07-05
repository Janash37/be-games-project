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
          expect(body.msg).toBe("Invalid input");
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
          expect(body.msg).toBe("Invalid input");
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
    test("returns status 200 and an array of review objects which are sorted in date descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("created_at", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("returns status 400 when the path is not found", () => {
      return request(app)
        .get("/api/review")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid path");
        });
    });
  });
});
