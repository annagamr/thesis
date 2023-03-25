const { verifySignUp } = require("../Middleware");

const controller = require("../Controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/c",
    [
      verifySignUp.checkDuplicateUsernameOrEmailAndRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};