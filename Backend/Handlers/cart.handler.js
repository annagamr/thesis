const { user, cart } = require("../Models");


exports.getCart = async (req, res) => {
    try {
        const myCart = await cart.findOne({ user: req.userId }).populate('items.product');
        res.status(200).json(myCart);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};


exports.addToCart = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Please log in or sign up to add products to the cart." });
    }

    let myCart = await cart.findOne({ user: req.userId }).populate("items.product").exec();

    if (!myCart) {
      myCart = new cart({
        user: req.userId,
        items: [{ product: req.params.productId }],
      });
    } else {
      const index = myCart.items.findIndex(
        (item) => item.product && item.product.toString() === req.params.productId
      );

      if (index === -1) {
        myCart.items.push({ product: req.params.productId });
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