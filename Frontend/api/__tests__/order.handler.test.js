const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

const orderHandler = require('../Handlers/order.handler');
const db = require('../Models');

let mongoServer;

describe('Order Controller', () => {
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
        await db.order.deleteMany({});

    });

    test('1. createOrder creates a new order', async () => {
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
            body: {
                status: 'successful',
                userId: mockUser._id,
                items: [newProduct._id]
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await orderHandler.createOrder(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.json.calledOnce).toBeTruthy();

        const createdOrder = await db.order.findOne({ author: mockUser._id }).populate('items');
        expect(createdOrder).toBeDefined();
        expect(createdOrder.status).toBe('successful');
        expect(createdOrder.items.length).toBe(1);
        expect(createdOrder.items[0]._id.toString()).toBe(newProduct.id);
    });

    test('2. getOrders returns orders for a user', async () => {
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

        const createOrderReq = {
            body: {
                status: 'successful',
                userId: mockUser._id,
                items: [newProduct._id]
            }
        };
        const createOrderRes = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await orderHandler.createOrder(createOrderReq, createOrderRes);

        const req = { params: { userId: mockUser._id } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await orderHandler.getOrders(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.json.calledOnce).toBeTruthy();

        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.orders.length).toBe(1);

        const orderData = responseBody.orders[0];
        expect(orderData.status).toBe('successful');
        expect(orderData.items.length).toBe(1);
    });
})