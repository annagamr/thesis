const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../Models/product.model');

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

describe('Product model', () => {
    test('should create a new product', async () => {
        const addedDate = new Date();
        const authorId =new mongoose.Types.ObjectId();

      const product = new Product({
        title: 'Test Product',
        description: 'This is a test product',
        image: 'https://example.com/test-product.jpg',
        category: 'Skin Care',
        added: addedDate,
        author: authorId,
        price: 1500,
        street: '12 Test Street',
        city: 'Budapest',
        zipCode: '1081',
        contactNumber: '+36205551635',
      });
  
      const savedProduct = await product.save();
      expect(savedProduct.title).toBe('Test Product');
      expect(savedProduct.description).toBe('This is a test product');
      expect(savedProduct.image).toBe('https://example.com/test-product.jpg');
      expect(savedProduct.category).toBe('Skin Care');
      expect(savedProduct.added).toEqual(addedDate);
      expect(savedProduct.author).toEqual(authorId);
      expect(savedProduct.price).toEqual(1500);
      expect(savedProduct.street).toEqual('12 Test Street');
      expect(savedProduct.city).toEqual('Budapest');
      expect(savedProduct.zipCode).toEqual('1081');
      expect(savedProduct.contactNumber).toEqual('+36205551635');
    });

    test('should not create a product without required fields', async () => {
        const product = new Product({
          title: 'Test Product',
          // Missing other required fields
        });
    
        await expect(product.save()).rejects.toThrow(mongoose.Error.ValidationError);
      });
})