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
    const cart = await cart.findOne({ user: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


