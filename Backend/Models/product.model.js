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
    image: {
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
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    }
});


const Product = mongoose.model("Product", productsSchema);

module.exports = Product;