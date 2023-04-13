//Importing mongoose library
const mongoose = require("mongoose");

//schema that describes user model
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    added: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number,
        required: true

    }
});


const Product = mongoose.model("Product", productsSchema);

module.exports = Product;