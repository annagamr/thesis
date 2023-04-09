const { post, user } = require("../Models");

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
        res.status(200).send({ message: "Post added successfully!", post: post });

    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        res.status(500).send({ message: err });
    }
};
const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};
exports.posts = async (req, res) => {
    try {
        const posts = await db.post.find({}).exec();

        // If no posts are found, return a 404 error
        if (!posts.length) {
            return res.status(404).send({ message: "No posts found" });
        }

        // Create a new array of post objects with the desired properties


        const formattedPosts = await db.post.find({})
            .populate('author', 'username')
            .exec()
            .then(posts => {
                return posts.map(post => {
                    // console.log(post);
                    return {
                        id: post._id,
                        title: post.title,
                        description: post.description,
                        tags: post.tags,
                        created: formatDate(post.created),
                        author: post.author.username
                    }
                });
            });

        // Send the formatted posts array in the response
        res.status(200).send(formattedPosts);
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message

        res.status(500).send({ message: err });
    }
};