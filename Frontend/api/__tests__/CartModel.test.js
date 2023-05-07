const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Cart = require('../Models/cart.model');

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

describe('Cart model', () => {
    test('Creates a new cart', async () => {
      const userId = new mongoose.Types.ObjectId();
      const productIds = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ];
  
      const cart = new Cart({
        user: userId,
        items: [
          { product: productIds[0] },
          { product: productIds[1] },
        ],
      });
  
      const savedCart = await cart.save();
      expect(savedCart.user).toEqual(userId);
      expect(savedCart.items.length).toBe(2);
      expect(savedCart.items[0].product).toEqual(productIds[0]);
      expect(savedCart.items[1].product).toEqual(productIds[1]);
    });
  });
