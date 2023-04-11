const controller = require("../Controllers/product.controller");

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
    "/api/add-product",
    controller.addProduct
  );

  app.get(
    "/api/products",
    controller.products
  );

};