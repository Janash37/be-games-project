exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err, "<<< inside PSQL error handler");
  if (err.code === "22P02" || err.code === "42601") {
    res.status(400).send({ msg: "400: invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "404: path not found" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err, "<<< inside custom error handler");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
    console.log(err.msg);
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, "<<< inside 500 error handler");
  res.status(500).send({ msg: "Internal server error" });
};
