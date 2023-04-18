const { verifyToken } = require("../Middleware/authJwt");
const { isAdmin } = require("../Middleware/authJwt");
const { isSeller } = require("../Middleware/authJwt");
const { isUser } = require("../Middleware/authJwt");
const productController = require("../Controllers/product.controller");
const postController = require("../Controllers/post.controller");
const authController = require("../Controllers/auth.controller");

const { checkDuplicateUsernameOrEmailAndRolesExisted } = require("../Middleware/verifySignUp");

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    storage: storage
});
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


    // Route for getting count of users
    app.get("/api/user-count",
        authController.countUsers);

    // Route for getting count of shops
    app.get("/api/shops-count",
        authController.countShops);

    // Route for creating products
    app.post(
        "/api/add-product",
        upload.single('prodImageFile'),
        productController.addProduct,

    );
    // Route for getting products
    app.get(
        "/api/products",
        productController.products
    );

    // Route for getting product image
    app.get(
        "/api/product-image/:id",
        productController.productImage
    );
    // Route for getting products by current author
    app.get('/api/productsbyAuthor/:author', productController.productsbyAuthor);


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
    // Route for deleting post
    app.delete(
        "/api/post-delete/:id",
        postController.deletePost
    );
    // Route for reseting password 
    app.post(
        "/api/forgot-password",
        authController.forgotPassword
    );
    // Route for reseting password step 2
    app.post(
        "/api/reset-password",
        authController.resetPassword
    );
    // Route for getting number of posts according to topic

    app.get("/api/countPostsByTopic/:topic", postController.countPostsByTopic);
    //Route for sign up
    app.post(
        "/api/auth/signup",
        checkDuplicateUsernameOrEmailAndRolesExisted,
        authController.signup
    );
    //Route for sign in
    app.post("/api/auth/signin", authController.signin);
};