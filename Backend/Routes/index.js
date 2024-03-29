const { verifyToken } = require("../Middleware/authMiddleware");
const { isAdmin } = require("../Middleware/authMiddleware");
const { isSeller } = require("../Middleware/authMiddleware");
const { isUser } = require("../Middleware/authMiddleware");
const productController = require("../Handlers/product.handler");
const postController = require("../Handlers/post.handler");
const authController = require("../Handlers/auth.handler");
const cartController = require("../Handlers/cart.handler");
const orderController = require("../Handlers/order.handler");

const { checkDuplicateUsernameOrEmailAndRolesExisted } = require("../Middleware/validationMiddleware");



// Require the 'multer' middleware for handling multipart/form-data, which is primarily used for uploading files
const multer = require('multer')

// Set up disk storage with multer. This determines where and under what name the uploaded files are saved.
const storage = multer.diskStorage({
    // Set the destination for storing the uploaded files to the 'public' directory
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    // Set the filename for the uploaded files to be the current date in milliseconds plus '.png'
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})

// Initialize multer with file filtering and storage options
const upload = multer({
    // Define a file filter function. This function will be called for each uploaded file.
    fileFilter: (req, file, cb) => {
        // Allow uploading of only PNG, JPG, and JPEG files. Reject all other file types.
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            // Throw an error if a file of a different format is uploaded
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    // Use the storage options defined earlier
    storage: storage
});


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
    app.get("/api/user", [verifyToken, isUser]);

    // Route for authenticated sellers
    app.get("/api/seller", [verifyToken, isSeller]);

    // Route for authenticated admins
    app.get("/api/admin", [verifyToken, isAdmin]);


    // Route for getting count of users
    app.get("/api/user-count",
        authController.countUsers);

    // Route for getting count of shops
    app.get("/api/shops-count",
        authController.countShops);

    /*--- ROUTES FOR PRODUCTS ---*/

    // Route for creating products
    app.post(
        "/api/add-product",
        verifyToken,
        upload.single('prodImageFile'),
        productController.addProduct,
    );
    // Route for getting products
    app.get(
        "/api/products",
        productController.products
    );
    // Route for getting specific product info
    app.get(
        "/api/products/:id",
        productController.getProductById
    );

    // Route for getting product image
    app.get(
        "/api/product-image/:id",
        productController.productImage
    );
    // Route for getting products by current author
    app.get('/api/productsbyAuthor/:author',
        productController.productsbyAuthor);

    // Route for deleting products
    app.delete(
        "/api/product-delete/:id",
        [verifyToken,
            productController.deleteProduct]
    );

    /*--- ROUTES FOR POSTS ---*/

    // Route for creating post
    app.post(
        "/api/create-post",
        [verifyToken,
            postController.createPost]
    );
    // Route for getting posts
    app.get(
        "/api/posts",
        postController.posts
    );

    // Route for getting number of posts according to topic

    app.get("/api/countPostsByTopic/:topic", postController.countPostsByTopic);

    // Route for deleting post
    app.delete(
        "/api/post-delete/:id",
        [verifyToken,
            postController.deletePost]
    );

    // Route for deleting users and shops
    app.delete(
        "/api/users-delete/:id",
        [verifyToken,
            authController.deleteUser]
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

    /*--- ROUTES FOR CART ---*/

    // Route adding product to cart
    app.post("/api/cart/add/:id", verifyToken, cartController.addToCart);

    // Route removing product from cart
    app.post("/api/cart/remove/:id", verifyToken, cartController.removeFromCart);

    // Route for getting items in user's cart
    app.post("/api/cart/products/:author", verifyToken, cartController.getCart);

    // Route for getting number of products in cart
    app.post("/api/cart/clear-cart", cartController.clearCart);

    /*--- ROUTES FOR ORDERS ---*/

    // Route for creating orders
    app.post("/api/order/create-order",
        [verifyToken,
            orderController.createOrder]);

    // Route for getting order of specific user
    app.get("/api/order/get-orders/:userId",
        [verifyToken,
            orderController.getOrders]);

    //Route for sign up
    app.post(
        "/api/auth/signup",
        checkDuplicateUsernameOrEmailAndRolesExisted,
        authController.signup
    );
    //Route for sign in
    app.post("/api/auth/signin", authController.signin);

    //Route for checking out (Stripe)
    app.post("/api/create-checkout-session", cartController.checkOut);
};