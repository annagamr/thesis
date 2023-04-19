const { Product, Cart } = require("../Models");


exports.getCart = async (req, res) => {
    try {
        const myCart = await Cart.findOne({ user: req.userId }).populate('items.product');
        res.status(200).json(myCart);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};


exports.addToCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId });

        if (!cart) {
            const newCart = new Cart({
                user: req.userId,
                items: [{ product: req.params.productId }],
            });

            await newCart.save();
            return res.status(201).json(newCart);
        }

        const index = cart.items.findIndex(
            (item) => item.product.toString() === req.params.productId
        );

        if (index === -1) {
            cart.items.push({ product: req.params.productId });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.userId });

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