//Importing mongoose library
const mongoose = require("mongoose");

//schema that describes user model
const orderSchema = new mongoose.Schema({
    status: {
        type: String,
    },
    created: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;