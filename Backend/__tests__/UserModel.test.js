const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../Models/user.model');
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

describe('User model', () => {
  test('Creates a new user', async () => {
    const role = new Role({ name: 'user' });
    const savedRole = await role.save();

    const user = new User({
      username: 'testUser',
      email: 'test@example.com',
      password: 'testPassword',
      roles: [savedRole._id],
    });

    const savedUser = await user.save();
    expect(savedUser.username).toBe('testUser');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.password).toBe('testPassword');
    expect(savedUser.roles).toEqual(expect.arrayContaining([savedRole._id]));
  });

  test('Does not create user if required fields are missing', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'testPassword',
      roles: [],
    });

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.username).toBeDefined();
    }
  });
});