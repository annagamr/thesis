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
          created: order.created,
          items: formattedItems,
        };
      });
  
      res.status(200).json({ orders: formattedOrders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user orders" });
    }
  };