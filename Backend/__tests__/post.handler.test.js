const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');

const Post = require('../Models/post.model');
const User = require('../Models/user.model');
const db = require('../Models');

let mongoServer;

beforeEach(async () => {
    await db.user.create({ username: 'testUser', email: 'test@example.com', password: 'testpassword' });
});

afterEach(async () => {
    await db.post.deleteMany({});
    await db.user.deleteMany({});
});

const postHandler = require('../Handlers/post.handler');
describe('Post Handler', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('createPost should create a new post and assign it to a user', async () => {
        const req = {
            body: {
                title: 'Test Post',
                description: 'Test description',
                topic: 'Test Topic',
                author: 'testUser'
            }
        };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await postHandler.createPost(req, res);

        const createdPost = await Post.findOne({ title: 'Test Post' });
        expect(createdPost).not.toBeNull();
        expect(res.send.calledOnceWith({ message: "Post Created!", post: sinon.match.object })).toBe(true);
    });

    test('posts should return all posts with populated author field and formatted date', async () => {
        await db.post.create({
            title: 'Test Post',
            description: 'Test description',
            topic: 'Test Topic',
            author: (await db.user.findOne({ username: 'testUser' }))._id,
            created: new Date()
        });

        const req = {};
        const res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await postHandler.posts(req, res);

        const response = res.json.getCall(0).args[0];
        expect(response.allPosts).toHaveLength(1);
        expect(response.count).toBe(1);
        const post = response.allPosts[0];
        expect(post.id.toString()).toMatch(/^[0-9a-fA-F]{24}$/);
        expect(post.title).toBe('Test Post');
        expect(post.description).toBe('Test description');
        expect(post.topic).toBe('Test Topic');
        expect(post.created).toMatch(/^\w{3}\s\d{1,2},\s\d{4},\s\d{1,2}:\d{2}\s(?:AM|PM)$/);
        expect(post.author).toBe('testUser');
    });

    test('countPostsByTopic should return the number of posts with a specified topic', async () => {
        await db.post.create({
            title: 'Test Post',
            description: 'Test description',
            topic: 'Test Topic',
            author: (await db.user.findOne({ username: 'testUser' }))._id,
            created: new Date()
        });

        const req = { params: { topic: 'Test Topic' } };
        const res = {
            send: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await postHandler.countPostsByTopic(req, res);

        expect(res.status.calledOnceWith(200)).toBe(true);
        expect(res.send.calledOnceWith({ count: 1 })).toBe(true);
    });

    test('deletePost should remove the specified post', async () => {
        const createdPost = await db.post.create({
            title: 'Test Post',
            description: 'Test description',
            topic: 'Test Topic',
            author: (await db.user.findOne({ username: 'testUser' }))._id,
            created: new Date()
        });

        const req = { params: { id: createdPost._id } };
        const res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis()
        };

        await postHandler.deletePost(req, res);

        const deletedPost = await Post.findById(createdPost._id);
        expect(deletedPost).toBeNull();
        expect(res.status.calledOnceWith(200)).toBe(true);
        expect(res.json.calledOnceWith({ message: 'Blog deleted successfully' })).toBe(true);
    });
});