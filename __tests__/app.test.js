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
  });
  // describe("PATCH /api/reviews/:review_id", () => {
  //   test.only("returns status 200 when a successful patch request is made", () => {
  //     const updateReview = { inc_votes: 1 };

  //     return request(app)
  //       .patch("/api/reviews/1")
  //       .send(updateReview)
  //       .expect(200)
  //       .then(({ body }) => {
  //         console.log(body);
  // const updatedReview = body.review;
  // expect(updatedReview).toEqual({
  //   title: "Agricola",
  //   designer: "Uwe Rosenberg",
  //   owner: "mallionaire",
  //   review_img_url:
  //     "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
  //   review_body: "Farmyard fun!",
  //   category: "euro game",
  //   created_at: new Date(1610964020514),
  //   votes: 2,
});
//     });
//   });
//   // });
// });
