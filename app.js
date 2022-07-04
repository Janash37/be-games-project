const express = require("express");
const app = express();
app.use(express.json());

const { getCategories } = require("./controllers/controllers");

//ENDPOINT MIDDLEWARE BELOW

app.get("/api/categories", getCategories);

//ERROR-HANDLING MIDDLEWARE BELOW

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: "Invalid Path" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code.length === 5) {
    res.status(400).send({ msg: "PSQL error, invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

//MODULE EXPORTS

module.exports = app;
