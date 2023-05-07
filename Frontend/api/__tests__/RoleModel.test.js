const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Role = require('../Models/role.model');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});


describe('Role model', () => {
    test('Creates a new role', async () => {
        const role = new Role({
            name: 'testRole',
        });
        const savedRole = await role.save();
        expect(savedRole.name).toBe('testRole');
    });

    test('Does not create a role without a name', async () => {
        const role = new Role({});
        await expect(role.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
});