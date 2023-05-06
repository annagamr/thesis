const request = require("supertest");
const express = require("express");
const routes = require("../Routes/index");
const jwt = require('jsonwebtoken');

jest.mock("../Middleware/authMiddleware");
jest.mock("../Middleware/validationMiddleware");
jest.mock("../Handlers/product.handler");
jest.mock("../Handlers/post.handler");
jest.mock("../Handlers/auth.handler");
jest.mock("../Handlers/cart.handler");
jest.mock("../Handlers/order.handler");

const { verifyToken } = require("../Middleware/authMiddleware");
const { checkDuplicateUsernameOrEmailAndRolesExisted } = require("../Middleware/validationMiddleware");
const productController = require("../Handlers/product.handler");
const postController = require("../Handlers/post.handler");
const authController = require("../Handlers/auth.handler");
const cartController = require("../Handlers/cart.handler");
const orderController = require("../Handlers/order.handler");

verifyToken.mockImplementation((req, res, next) => {
    req.userId = 'sampleUserId';
    next();
});

checkDuplicateUsernameOrEmailAndRolesExisted.mockImplementation((req, res, next) => {
    next();
});
const app = express();
app.use(express.json());
routes(app);
const server = app.listen();


describe("App routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
        server.close();

    });

    // Test for getting count of users
    test("1. GET /api/user-count should return 200", async () => {
        // Mock the countUsers function to return a successful response
        authController.countUsers.mockImplementation((req, res, next) => {
            res.status(200).json({ count: 42 });
        });

        const res = await request(app).get("/api/user-count");
        expect(res.status).toBe(200);
        expect(authController.countUsers).toHaveBeenCalledTimes(1);
    });

    // Test for getting count of shops
    test("2. GET /api/shops-count should return 200", async () => {
        authController.countShops.mockImplementation((req, res, next) => {
            res.status(200).json({ count: 10 });
        });

        const res = await request(app).get("/api/shops-count");
        expect(res.status).toBe(200);
        expect(authController.countShops).toHaveBeenCalledTimes(1);
    });

    // Test for getting products
    test("4. GET /api/products should return 200", async () => {
        productController.products.mockImplementation((req, res, next) => {
            res.status(200).json([{ id: 1, name: 'Product 1' }]);
        });

        const res = await request(app).get("/api/products");
        expect(res.status).toBe(200);
        expect(productController.products).toHaveBeenCalledTimes(1);
    });

    // Test for getting specific product info
    test("5. GET /api/products/:id should return 200", async () => {
        const productId = 1;
        productController.getProductById.mockImplementation((req, res, next) => {
            res.status(200).json({ id: productId, name: 'Product 1' });
        });

        const res = await request(app).get(`/api/products/${productId}`);
        expect(res.status).toBe(200);
        expect(productController.getProductById).toHaveBeenCalledTimes(1);
    });

    // Test for getting product image
    test("6. GET /api/product-image/:id should return 200", async () => {
        const productId = 1;
        productController.productImage.mockImplementation((req, res, next) => {
            res.status(200).send();
        });

        const res = await request(app).get(`/api/product-image/${productId}`);
        expect(res.status).toBe(200);
        expect(productController.productImage).toHaveBeenCalledTimes(1);
    });

    // Test for getting products by current author
    test("7. GET /api/productsbyAuthor/:author should return 200", async () => {
        const authorId = 1;
        productController.productsbyAuthor.mockImplementation((req, res, next) => {
            res.status(200).json([{ id: 1, name: 'Product 1', author: authorId }]);
        });

        const res = await request(app).get(`/api/productsbyAuthor/${authorId}`);
        expect(res.status).toBe(200);
        expect(productController.productsbyAuthor).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual([{ id: 1, name: 'Product 1', author: authorId }]);
    });

    // Test for creating a post
    test("8. POST /api/create-post should return 201", async () => {
        postController.createPost.mockImplementation((req, res, next) => {
            res.status(201).json({ message: "Post created" });
        });

        const res = await request(app).post("/api/create-post").send({ title: 'Test post', content: 'This is a test post' });
        expect(res.status).toBe(201);
        expect(postController.createPost).toHaveBeenCalledTimes(1);
    });

    // Test for getting posts
    test("9. GET /api/posts should return 200", async () => {
        postController.posts.mockImplementation((req, res, next) => {
            res.status(200).json([{ id: 1, title: 'Post 1', content: 'This is post 1' }]);
        });

        const res = await request(app).get("/api/posts");
        expect(res.status).toBe(200);
        expect(postController.posts).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual([{ id: 1, title: 'Post 1', content: 'This is post 1' }]);
    });

    // Test for deleting a post
    test("10. DELETE /api/post-delete/:id should return 200", async () => {
        const postId = 1;
        postController.deletePost.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Post deleted" });
        });

        const res = await request(app).delete(`/api/post-delete/${postId}`);
        expect(res.status).toBe(200);
        expect(postController.deletePost).toHaveBeenCalledTimes(1);
    });

    // Test for deleting a product
    test("11. DELETE /api/product-delete/:id should return 200", async () => {
        const productId = 1;
        productController.deleteProduct.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Product deleted" });
        });

        const res = await request(app).delete(`/api/product-delete/${productId}`);
        expect(res.status).toBe(200);
        expect(productController.deleteProduct).toHaveBeenCalledTimes(1);
    });

    // Test for deleting a user
    test("12. DELETE /api/users-delete/:id should return 200", async () => {
        const userId = 1;
        authController.deleteUser.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "User deleted" });
        });

        const res = await request(app).delete(`/api/users-delete/${userId}`);
        expect(res.status).toBe(200);
        expect(authController.deleteUser).toHaveBeenCalledTimes(1);
    });

    // Test for forgot password
    test("13. POST /api/forgot-password should return 200", async () => {
        authController.forgotPassword.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Password reset email sent" });
        });

        const res = await request(app).post("/api/forgot-password").send({ email: 'test@example.com' });
        expect(res.status).toBe(200);
        expect(authController.forgotPassword).toHaveBeenCalledTimes(1);
    });

    // Test for reset password
    test("14. POST /api/reset-password should return 200", async () => {
        authController.resetPassword.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Password reset successfully" });
        });

        const res = await request(app).post("/api/reset-password").send({ token: 'test-token', newPassword: 'new-password' });
        expect(res.status).toBe(200);
        expect(authController.resetPassword).toHaveBeenCalledTimes(1);
    });

    // Test for getting number of posts according to topic
    test("15. GET /api/countPostsByTopic/:topic should return 200", async () => {
        const topic = 'test-topic';
        postController.countPostsByTopic.mockImplementation((req, res, next) => {
            res.status(200).json({ count: 5 });
        });

        const res = await request(app).get(`/api/countPostsByTopic/${topic}`);
        expect(res.status).toBe(200);
        expect(postController.countPostsByTopic).toHaveBeenCalledTimes(1);
    });

    // Test for adding a product to the cart
    test("16. POST /api/cart/add/:id should return 200", async () => {
        const productId = 1;
        cartController.addToCart.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Product added to cart" });
        });

        verifyToken.mockImplementation((req, res, next) => {
            req.userId = 'sampleUserId';
            next();
        });

        // Create a test token
        const testToken = jwt.sign({ id: 'sampleUserId' }, "my-secret-key", {
            expiresIn: 86400, // 24 hours
        });

        const res = await request(app)
            .post(`/api/cart/add/${productId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(cartController.addToCart).toHaveBeenCalledTimes(1);
    });

    // Test for removing a product from the cart
    test("17. POST /api/cart/remove/:id should return 200", async () => {
        const productId = 1;
        cartController.removeFromCart.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Product removed from cart" });
        });

        verifyToken.mockImplementation((req, res, next) => {
            req.userId = 'sampleUserId';
            next();
        });

        const testToken = jwt.sign({ id: 'sampleUserId' }, "my-secret-key", {
            expiresIn: 86400, // 24 hours
        });

        const res = await request(app)
            .post(`/api/cart/remove/${productId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(cartController.removeFromCart).toHaveBeenCalledTimes(1);
    });

    // Test for getting items in user's cart
    test("18. POST /api/cart/products/:author should return 200", async () => {
        const authorId = 1;
        cartController.getCart.mockImplementation((req, res, next) => {
            res.status(200).json([{ id: 1, name: 'Product 1', author: authorId }]);
        });

        verifyToken.mockImplementation((req, res, next) => {
            req.userId = 'sampleUserId';
            next();
        });

        const testToken = jwt.sign({ id: 'sampleUserId' }, "my-secret-key", {
            expiresIn: 86400, // 24 hours
        });

        const res = await request(app)
            .post(`/api/cart/products/${authorId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(cartController.getCart).toHaveBeenCalledTimes(1);
    });

    // Test for clearing the cart
    test("19. POST /api/cart/clear-cart should return 200", async () => {
        cartController.clearCart.mockImplementation((req, res, next) => {
            res.status(200).json({ message: "Cart cleared" });
        });

        verifyToken.mockImplementation((req, res, next) => {
            req.userId = 'sampleUserId';
            next();
        });

        const testToken = jwt.sign({ id: 'sampleUserId' }, "my-secret-key", {
            expiresIn: 86400, // 24 hours
        });

        const res = await request(app)
            .post("/api/cart/clear-cart")
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(cartController.clearCart).toHaveBeenCalledTimes(1);
    });

    // Test for creating an order
    test("20. POST /api/order/create-order should return 201", async () => {
        orderController.createOrder.mockImplementation((req, res, next) => {
            res.status(201).json({ message: "Order created" });
        });

        verifyToken.mockImplementation((req, res, next) => {
            req.userId = 'sampleUserId';
            next();
        });

        const testToken = jwt.sign({ id: 'sampleUserId' }, "my-secret-key", {
            expiresIn: 86400, // 24 hours
        });

        const res = await request(app)
            .post("/api/order/create-order")
            .set('Authorization', `Bearer ${testToken}`)
            .send({ items: [{ productId: 1, quantity: 2 }] });

        expect(res.status).toBe(201);
        expect(orderController.createOrder).toHaveBeenCalledTimes(1);
    });

    // Test for getting orders of a specific user
    test("21. GET /api/order/get-orders/:userId should return 200", async () => {
        const userId = 'sampleUserId';
        orderController.getOrders.mockImplementation((req, res, next) => {
            res.status(200).json([{ id: 1, items: [{ productId: 1, quantity: 2 }] }]);
        });

        const res = await request(app).get(`/api/order/get-orders/${userId}`);
        expect(res.status).toBe(200);
        expect(orderController.getOrders).toHaveBeenCalledTimes(1);
    });

    // Test for signing in
    test("22. POST /api/auth/signin should return 200", async () => {

        authController.signin.mockImplementation((req, res, next) => {
            res.status(200).json({ accessToken: 'test-access-token', message: "User signed in successfully!" });
        });

        const res = await request(app).post("/api/auth/signin").send({ username: 'testuser', password: 'password123' });

        expect(res.status).toBe(200);
        expect(authController.signin).toHaveBeenCalledTimes(1);
    });

    // Test for signing up
    test("23. POST /api/auth/signup should return 201", async () => {
        authController.signup.mockImplementation((req, res, next) => {
            res.status(201).json({ message: "User signed up successfully!" });
        });

        const res = await request(app)
            .post("/api/auth/signup")
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123', roles: ['user'] });

        expect(res.status).toBe(201);
        expect(checkDuplicateUsernameOrEmailAndRolesExisted).toHaveBeenCalledTimes(1);
        expect(authController.signup).toHaveBeenCalledTimes(1);
    });

});