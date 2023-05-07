const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const User = require('../Models/user.model');
const db = require('../Models');

beforeEach(async () => {
    await db.role.create({ name: 'user' });
    await db.role.create({ name: 'admin' });
    await db.role.create({ name: 'seller' });
});
afterEach(async () => {
    await db.user.deleteMany({});
    await db.role.deleteMany({});
});
// Mock nodemailer to avoid sending emails during testing
const nodemailerMock = {
    createTransport: () => ({
        sendMail: sinon.stub().resolves()
    })
};

// Import the authHandler with nodemailer dependency mocked
const authHandler = proxyquire('../Handlers/auth.handler', { nodemailer: nodemailerMock });

describe('Auth handler', () => {
    afterEach(async () => {
        await User.deleteMany({});
    });
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('1. signup should create a new user', async () => {
        const req = {
            body: {
                username: 'testUser',
                email: 'test@example.com',
                password: 'testPassword',
                roles: ['user']
            }
        };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await authHandler.signup(req, res);

        const createdUser = await User.findOne({ email: 'test@example.com' });
        expect(createdUser).not.toBeNull();
        expect(res.send.calledOnceWith({ message: 'User registered successfully!' })).toBe(true);
    });

    test('2. signup should assign default user role if none specified', async () => {
        const userData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword'
        };
        const req = { body: userData };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await authHandler.signup(req, res);

        const createdUser = await User.findOne({ email: userData.email }).populate('roles');
        expect(createdUser.roles.map(role => role.name)).toContain('user');
    });
    test('3. signin should return user data and access token with valid credentials', async () => {
        const userData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword',
            roles: ['user']
        };
        await authHandler.signup({ body: userData }, { send: () => { }, status: () => ({ send: () => { } }) });

        const req = {
            body: {
                username: userData.username,
                password: userData.password
            }
        };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await authHandler.signin(req, res);

        const sentData = res.send.getCall(0).args[0];
        expect(sentData.username).toBe(userData.username);
        expect(sentData.email).toBe(userData.email);
        expect(sentData.roles).toEqual(['ROLE_USER']);
        expect(sentData.accessToken).toBeTruthy();
    });

    test('4. signin should return an error with invalid credentials', async () => {
        const userData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword',
            roles: ['user']
        };
        await authHandler.signup({ body: userData }, { send: () => { }, status: () => ({ send: () => { } }) });

        const req = {
            body: {
                username: userData.username,
                password: 'wrongPassword'
            }
        };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await authHandler.signin(req, res);

        expect(res.status.calledOnceWith(401)).toBe(true);
        expect(res.send.calledOnceWith({ accessToken: null, message: 'Invalid password!' })).toBe(true);
    });

    test('5. countUsers should return the number of registered users', async () => {
        const userData = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'testPassword',
            roles: ['user']
        };
        await authHandler.signup({ body: userData }, { send: () => { }, status: () => ({ send: () => { } }) });

        const req = {};
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        await authHandler.countUsers(req, res);

        expect(res.status.calledOnceWith(200)).toBe(true);
        expect(res.json.calledOnceWith({ count: 1, users: sinon.match.array })).toBe(true);
    });

    test('6. deleteUser should remove the user and their associated data', async () => {
        const userData = {
          username: 'testUser',
          email: 'test@example.com',
          password: 'testPassword',
          roles: ['user']
        };
        await authHandler.signup({ body: userData }, { send: () => {}, status: () => ({ send: () => {} }) });
        const userToDelete = await User.findOne({ email: userData.email });
      
        const req = { params: { id: userToDelete._id } };
        const res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
        };
      
        await authHandler.deleteUser(req, res);
      
        const deletedUser = await User.findById(userToDelete._id);
        expect(deletedUser).toBeNull();
    });
});






