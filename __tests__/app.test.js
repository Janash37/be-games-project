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
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("returns status 400 when a bad request is made", () => {
      return request(app)
        .get("/api/reviews/0")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid query!");
        });
    });
  });
});
