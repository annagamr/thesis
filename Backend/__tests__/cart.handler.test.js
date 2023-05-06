const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

const cartHandler = require('../Handlers/cart.handler');
const db = require('../Models');

let mongoServer;

describe('Cart Controller', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await db.user.create({
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword'
        });
    });

    afterEach(async () => {
        await db.cart.deleteMany({});
        await db.product.deleteMany({});
        await db.user.deleteMany({});
    });

    test('1. getCart returns an empty cart for a new user', async () => {
        const mockUser = await db.user.findOne({ username: 'testUser' });

        const req = { params: { author: mockUser._id } };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        };

        await cartHandler.getCart(req, res);
        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.send.calledWith({ numberOfItems: 0, cartItems: [] })).toBeTruthy();
    });

    test('2. addToCart adds a product to an empty cart', async () => {
        const mockUser = await db.user.findOne({ username: 'testUser' });

        const newProduct = await db.product.create({
            image: 'path/to/image',
            title: 'Test Product',
            description: 'Test description',
            category: 'Test Category',
            author: mockUser._id,
            price: 100,
            street: 'Test Street',
            city: 'Test City',
            zipCode: '12345',
            contactNumber: '555-1234'
        });

        const req = {
            userId: mockUser._id,
            params: { id: newProduct._id },
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await cartHandler.addToCart(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.json.calledOnce).toBeTruthy();
        const updatedCart = await db.cart.findOne({ user: mockUser._id }).populate('items.product');
        expect(updatedCart.items.length).toBe(1);
        expect(updatedCart.items[0].product.id).toBe(newProduct.id);
    });

    test('3. removeFromCart removes a product successfully', async () => {
        const mockUser = await db.user.findOne({ username: 'testUser' });

        const newProduct = await db.product.create({
            image: 'path/to/image',
            title: 'Test Product',
            description: 'Test description',
            category: 'Test Category',
            author: mockUser._id,
            price: 100,
            street: 'Test Street',
            city: 'Test City',
            zipCode: '12345',
            contactNumber: '555-1234'
        });

        await db.cart.create({
            user: mockUser._id,
            items: [{ product: newProduct._id }],
        });

        const req = {
            userId: mockUser._id,
            params: { id: newProduct._id },
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        };

        await cartHandler.removeFromCart(req, res);

        expect(res.status.firstCall.args[0]).toBe(200);
        expect(res.send.callCount).toBe(1);
        const updatedCart = await db.cart.findOne({ user: mockUser._id });
        expect(updatedCart.items.length).toBe(0);
    });
})