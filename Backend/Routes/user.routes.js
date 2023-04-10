const { verifyToken } = require("../Middleware/authJwt");
const { isAdmin } = require("../Middleware/authJwt");
const { isSeller } = require("../Middleware/authJwt");
const { isUser } = require("../Middleware/authJwt");


function success(req, res) {
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
  app.get("/api/test/all", success);

  // Route for authenticated users
  app.get("/api/test/user", [verifyToken, isUser], success);

  // Route for authenticated sellers
  app.get("/api/test/seller", [verifyToken, isSeller], success);

  // Route for authenticated admins
  app.get("/api/test/admin", [verifyToken, isAdmin], success);
};