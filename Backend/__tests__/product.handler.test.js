const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

const productHandler = require('../Handlers/product.handler');
const db = require('../Models');

let mongoServer;

describe('Product Handler', () => {
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
        await db.product.deleteMany({});
        await db.user.deleteMany({});
    });

    test('addProduct should add a product to the database with the provided data', async () => {
        const req = {
            body: {
                image: 'path/to/image',
                title: 'Test Product',
                description: 'Test description',
                category: 'Test Category',
                author: 'testUser',
                price: 100,
                street: 'Test Street',
                city: 'Test City',
                zipCode: '12345',
                contactNumber: '555-1234'
            },
            file: {
                path: 'path/to/image'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        await productHandler.addProduct(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.send.called).toBeTruthy();

        const addedProduct = await db.product.findOne({ title: 'Test Product' });
        expect(addedProduct).not.toBeNull();
        expect(addedProduct.title).toBe('Test Product');
    });

    test('products should return an empty array when there are no products', async () => {
        const req = {
            query: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        await productHandler.products(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.send.calledWith({ products: [], count: 0 })).toBeTruthy();
    });

    test('products should return all products with populated author field and formatted date', async () => {
        await db.product.create({
            image: 'path/to/image',
            title: 'Test Product',
            description: 'Test description',
            category: 'Test Category',
            author: (await db.user.findOne({ username: 'testUser' }))._id,
            price: 100,
            street: 'Test Street',
            city: 'Test City',
            zipCode: '12345',
            contactNumber: '555-1234'
        });

        const req = {
            query: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        await productHandler.products(req, res);

        expect(res.status.calledWith(200)).toBeTruthy();
        expect(res.json.calledOnce).toBeTruthy();

        const response = res.json.getCall(0).args[0];
        expect(response.products).toHaveLength(1);
        expect(response.count).toBe(1);

        const product = response.products[0];
        expect(product.id).toBeDefined();
        expect(product.image).toBe('path/to/image');
        expect(product.title).toBe('Test Product');
        expect(product.description).toBe('Test description');
        expect(product.category).toBe('Test Category');
        expect(product.author).toBe('testUser');
        expect(product.price).toBe(100);
        expect(product.street).toBe('Test Street');
        expect(product.city).toBe('Test City');
        expect(product.zipCode).toBe('12345');
        expect(product.contactNumber).toBe('555-1234');
        expect(new Date(product.added)).not.toBeNaN();
    });
});
