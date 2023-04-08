//Importing mongoose library
const mongoose = require("mongoose");

//schema that describes user model
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
    created: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


const Post = mongoose.model("Post", postSchema);

module.exports = Post;