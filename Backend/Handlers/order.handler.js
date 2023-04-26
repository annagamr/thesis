const { user, cart, order } = require("../Models");

exports.createOrder = async (req, res) => {
    try {
        const { status, userId, items } = req.body;

        const newOrder = new order({
            status,
            created: new Date(),
            author: userId,
            items,
        });

        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (error) {
        console.log('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }

};