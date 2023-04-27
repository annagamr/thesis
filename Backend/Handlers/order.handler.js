const { user, cart, order } = require("../Models");
const { v4: uuidv4 } = require('uuid');
exports.createOrder = async (req, res) => {
  try {
    const { status, userId, items } = req.body;

    const orderId = uuidv4(); // Generate a UUID for the order

    const existingOrder = await order.findOne({ _id: orderId });
    if (existingOrder) {
      // If an order with the same UUID already exists, return a 409 Conflict status code
      return res.status(409).json({ message: 'Order already exists' });
    }

    const newOrder = new order({
      _id: orderId,
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

const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

exports.getOrders = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await order.find({ author: userId })
      .populate({
        path: 'items',
        model: 'Product',
        populate: {
          path: 'author',
          model: 'User',
        },
      });

    const formattedOrders = orders.map((order) => {
      const formattedItems = order.items.map((item) => {
        const sanitizedPath = item.image.replace(/\\/g, "/");

        return {
          id: item._id,
          title: item.title,
          image: sanitizedPath,
          description: item.description,
          category: item.category,
          author: item.author.username,
          price: item.price,
          street: item.street,
          city: item.city,
          zipCode: item.zipCode,
          contactNumber: item.contactNumber,
        };
      });

      return {
        id: order._id,
        status: order.status,
        created: formatDate(order.created),
        items: formattedItems,
      };
    });

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
};