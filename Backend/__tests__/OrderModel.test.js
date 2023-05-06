const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Order = require('../Models/order.model');

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

describe('Order model', () => {
    test('Creates a new order', async () => {
      const createdDate = new Date();
      const authorId = new mongoose.Types.ObjectId();
      const items = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];
  
      const order = new Order({
        _id: 'testOrderID',
        status: 'Pending',
        created: createdDate,
        author: authorId,
        items,
      });
  
      const savedOrder = await order.save();
      expect(savedOrder._id).toBe('testOrderID');
      expect(savedOrder.status).toBe('Pending');
      expect(savedOrder.created).toEqual(createdDate);
      expect(savedOrder.author).toEqual(authorId);
      expect(savedOrder.items).toEqual(expect.arrayContaining(items));
    });
  });