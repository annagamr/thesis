// const { checkDuplicateUsernameOrEmailAndRolesExisted  } = require("../Middleware/verifySignUp");

const controller = require("../Controllers/post.controller");

module.exports = (app) => {
  // Set headers to allow specified HTTP request headers
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // api for creating post
  app.post(
    "/api/create-post",
    controller.createPost
  );

  app.get(
    "/api/posts",
    controller.posts
  );

};