module.exports = function simpleLogger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
