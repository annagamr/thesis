const { checkDuplicateUsernameOrEmailAndRolesExisted  } = require("../Middleware/verifySignUp");

const controller = require("../Controllers/auth.controller");

module.exports = (app) => {
  // Set headers to allow specified HTTP request headers
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Set up user authentication endpoints
  app.post(
    "/api/auth/signup",
    checkDuplicateUsernameOrEmailAndRolesExisted ,
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};