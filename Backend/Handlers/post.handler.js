const { post, user } = require("../Models");

const db = require("../Models");


async function create(postData) {
    // Create a new post with the given post data
    const post = new db.post({
        title: postData.title,
        description: postData.description,
        topic: postData.topic,
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
        res.status(200).send({ message: "Post Created!", post: post });

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
    // Sort the posts in descending order (newest first) using the 'created' field
    const posts = await db.post.find({}).sort({ created: -1 }).exec();

    // If no posts are found, return an empty array with a 200 status code
    if (!posts.length) {
      return res.status(200).send({ allPosts: [], count: 0 });
    }

    // Create a new array of post objects with the desired properties
    const formattedPosts = await db.post
      .find({})
      .populate("author", "username")
      .sort({ created: -1 }) // Apply the sorting to the formattedPosts as well
      .exec()
      .then((posts) => {
        return posts.map((post) => {
          return {
            id: post._id,
            title: post.title,
            description: post.description,
            topic: post.topic,
            created: formatDate(post.created),
            author: post.author.username,
          };
        });
      });

    const count = formattedPosts.length;

    // Send the formatted posts array in the response
    res.status(200).json({ allPosts: formattedPosts, count: count });
  } catch (err) {
    // If an error occurs, send a 500 error response to the client with the error message
    console.log(err);
    res.status(500).send({ message: err });
  }
};

exports.countPostsByTopic = async (req, res) => {
    try {
      const count = await db.post.countDocuments({ topic: req.params.topic });
      res.status(200).send({ count });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  exports.deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(500).json({ message: 'Blog not found' });
      }
  
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blog', error });
    }
  };