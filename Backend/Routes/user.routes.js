const { verifyToken } = require("../Middleware/authJwt");
const { isAdmin } = require("../Middleware/authJwt");
const { isSeller } = require("../Middleware/authJwt");

function userBoard(req, res) {
  res.status(201);
}

function adminBoard(req, res) {
  res.status(201);
}

function sellerBoard(req, res) {
  res.status(201);
}

function allAccess(req, res) {
  res.status(201);
}
module.exports = function (app) {
  // Set headers to allow specified HTTP request headers
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Define routes for testing authentication and authorization

  // Route for public access
  app.get("/api/test/all", allAccess);

  // Route for authenticated users
  app.get("/api/test/user", [verifyToken], userBoard);

  // Route for authenticated sellers
  app.get("/api/test/seller", [verifyToken, isSeller], sellerBoard);

  // Route for authenticated admins
  app.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);
};