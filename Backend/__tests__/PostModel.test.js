const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Post = require('../Models/post.model');

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

describe('Post model', () => {
    test('should create a new post', async () => {
      const createdDate = new Date();
      const authorId = new mongoose.Types.ObjectId();
  
      const post = new Post({
        title: 'Test Post',
        description: 'This is a test post',
        topic: 'Testing',
        created: createdDate,
        author: authorId,
      });
  
      const savedPost = await post.save();
      expect(savedPost.title).toBe('Test Post');
      expect(savedPost.description).toBe('This is a test post');
      expect(savedPost.topic).toBe('Testing');
      expect(savedPost.created).toEqual(createdDate);
      expect(savedPost.author).toEqual(authorId);
    });

    test('should not create a post without required fields', async () => {
        const post = new Post({
          title: 'Test Post',
          // Missing other required fields
        });
    
        await expect(post.save()).rejects.toThrow(mongoose.Error.ValidationError);
      });
  });