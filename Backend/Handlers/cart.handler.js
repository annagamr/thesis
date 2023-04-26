const { user, cart, product } = require("../Models");

exports.getCart = async (req, res) => {
  try {
    const myCart = await cart
      .findOne({ user: req.params.author })
      .populate({
        path: 'items.product',
        model: 'Product',
        populate: {
          path: 'author',
          model: 'User',
        },
      });

    if (!myCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate the total number of items in the cart
    const numberOfItems = myCart ? myCart.items.length : 0;


    // Create a new array of formatted cart items with the desired properties
    const formattedCartItems = myCart.items.map((item) => {
      const sanitizedPath = item.product.image.replace(/\\/g, "/");

      return {
        id: item._id,
        title: item.product.title,
        image: sanitizedPath,

        description: item.product.description,
        category: item.product.category,
        author: item.product.author.username,
        price: item.product.price,

        street: item.product.street,
        city: item.product.city,
        zipCode: item.product.zipCode,
        contactNumber: item.product.contactNumber,
      };
    });

    res.status(200).send({ numberOfItems, cartItems: formattedCartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



exports.addToCart = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Please Log in or Sign up to add products to the cart." });
    }
    // Check if the product exists
    const productt = await product.findById(req.params.id);
    if (!productt) {
      return res.status(404).json({ message: "Product not found." });
    }

    let myCart = await cart.findOne({ user: req.userId }).populate("items.product").exec();

    if (!myCart) {
      myCart = new cart({
        user: req.userId,
        items: [{ product: req.params.id }],
      });
    } else {
      const index = myCart.items.findIndex(
        (item) => item.product && item.product.toString() === req.params.id
      );

      if (index === -1) {
        myCart.items.push({ product: req.params.id });
      }
    }

    await myCart.save();
    const populatedCart = await cart.populate(myCart, { path: "items.product" });
    res.status(200).json(populatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.userId;

    // Get the item ID from the request params
    const itemId = req.params.id;

    // Find the user's cart
    const userCart = await cart.findOne({ user: userId });

    if (!userCart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    // Check if the item exists in the user's cart
    const itemIndex = userCart.items.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    userCart.items.splice(itemIndex, 1);

    // Save the updated cart
    await userCart.save();

    res.status(200).send({ message: "Item removed from cart", cartItems: userCart.items });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};


const stripe = require('stripe')('sk_test_51N09ASL7vL0HlrdBEcqFg7psp4WZ14zWE1wAhApkSAkcb4TP8oNzfrccCrDbFgNdKMtDz386F1meK1tdbNrItVt900xEginu6W');
exports.checkOut = async (req, res) => {
  const price = await stripe.prices.create({
    unit_amount: req.body.price,
    currency: 'huf',
    product_data: {
      name: "Total:"
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/myOrders`,
    cancel_url: `http://localhost:3000/cart`,
  });

  // Return the session ID instead of redirecting
  res.json({ sessionId: session.id });
};