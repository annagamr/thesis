const { post } = require("../Models");
const db = require("../Models");


async function create(postData) {
    // Create a new post with the given post data
    const post = new db.post({
        title: postData.title,
        description: postData.description,
        tags: postData.tags,
        created: new Date()
    });

    // Save the post to the database and return the result
    return post.save();
}

async function assignPostToUser(user, post) {
    // Find user in the database that match the given username
    const query = db.user.where({ username: user });
    const foundUser = await query.findOne();
    // console.log(foundUser);
    // Map the found user to their IDs and set them as the post's author
    // post.author = foundUser.map(user => user._id);
    post.author = foundUser._id;
    // Save the updated post to the database and return the result
    return post.save();
}

exports.createPost = async (req, res) => {
    try {
        // Create a new post using the request body data
        const post = await create(req.body);
        const user = req.body.author;
        await assignPostToUser(user, post);

        // Send a success message to the client
        res.status(200).send({ message: "Post added successfully!" });

    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        res.status(500).send({ message: err });
    }
};

exports.posts = async (req, res) => {
    try {
        // Find the user in the database with the provided username and populate their roles
        const post = await db.post.find({}).exec();

        // If no user is found with the given username, return a 404 error
        if (!post) {
            return res.status(404).send({ message: "No posts found" });
        }

        // Send a response to the client with the user's ID, username, email, roles, and access token
        res.status(200).send({
            id: post._id,
            title: post.title,
            description: post.description,
            tags: post.tags,
            created: post.created,
            author: post.author,

        });
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        res.status(500).send({ message: err });
    }
};