const { verifyToken } = require("../Middleware/authJwt");
const { isAdmin } = require("../Middleware/authJwt");
const { isSeller } = require("../Middleware/authJwt");
const { isUser } = require("../Middleware/authJwt");
const productController = require("../Controllers/product.controller");
const postController = require("../Controllers/post.controller");
const authController = require("../Controllers/auth.controller");
const { checkDuplicateUsernameOrEmailAndRolesExisted } = require("../Middleware/verifySignUp");


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

    // Route for authenticated users
    app.get("/api/user", [verifyToken, isUser], success);

    // Route for authenticated sellers
    app.get("/api/seller", [verifyToken, isSeller], success);

    // Route for authenticated admins
    app.get("/api/admin", [verifyToken, isAdmin], success);

    // Route for creating products
    app.post(
        "/api/add-product",
        productController.addProduct
    );
    // Route for getting products
    app.get(
        "/api/products",
        productController.products
    );
    // Route for creating post
    app.post(
        "/api/create-post",
        postController.createPost
    );
    // Route for getting posts
    app.get(
        "/api/posts",
        postController.posts
    );
    //Route for sign up
    app.post(
        "/api/auth/signup",
        checkDuplicateUsernameOrEmailAndRolesExisted,
        authController.signup
    );
    //Route for sign in
    app.post("/api/auth/signin", authController.signin);
};