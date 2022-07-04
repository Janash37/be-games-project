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

<<<<<<< HEAD
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
      return request(app).get("/api/review/1").expect(200);
    });
=======
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
>>>>>>> 20ecc1fc1e39000dcc8484300477b865c4f41368
  });
});
