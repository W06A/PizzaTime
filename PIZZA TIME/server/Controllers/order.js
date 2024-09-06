const Order = require('../Models/order');
const User = require('../Models/user');
const ToppingsData = require('../toppingsData');

const createOrder = async (req, res) => {
  try {
    const { method, size, crust, quantity, toppings } = req.body;

    // Validate the input
    if (!method || !size || !crust || !quantity || !Array.isArray(toppings) || toppings.length === 0) {
      return res.status(400).json({ error: 'All fields are required and toppings must be a non-empty array.' });
    }

    // Calculate the base price based on selected toppings and size
    let basePrice = 0;
    const orderToppings = toppings.map((topping) => {
      const toppingObj = ToppingsData.find((t) => t.name === topping);
      if (!toppingObj) {
        throw new Error(`Topping '${topping}' not found`);
      }
      const toppingPrice = toppingObj.prices[0][size]; // Ensure we're accessing the price correctly
      if (typeof toppingPrice !== 'number') {
        throw new Error(`Price for size '${size}' not found for topping '${topping}'`);
      }
      basePrice += toppingPrice;
      return {
        name: topping,
        size,
        price: toppingPrice,
      };
    });

    basePrice *= quantity;
    const fee = 5; // Example fixed fee
    const taxRate = 0.1; // Example tax rate of 10%
    const tax = basePrice * taxRate;
    const totalPrice = basePrice + fee + tax;

    const order = new Order({
      method,
      size,
      crust,
      quantity,
      toppings: orderToppings,
      basePrice, 
      fee,
      tax,
      totalPrice,
    });

    const savedOrder = await order.save();
    const orderCount = await Order.countDocuments({});
    res.json({ order: savedOrder, count: orderCount });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments({});
    res.json({ count: orderCount });
  } catch (error) {
    console.error('Error fetching order count:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const favoriteOrder = async (req, res) => {
  const { userId,id } = req.params;
  

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle favorite status
    order.isFavorite = !order.isFavorite;
    await order.save();

    // Update user's favorite orders
    if (order.isFavorite) {
      user.checkedFavorites.push(order._id);
    } else {
      user.checkedFavorites = user.checkedFavorites.filter(id => id.toString() !== order._id.toString());
    }
    await user.save();

    res.json({ user, order });
  } catch (error) {
    console.error('Error marking order as favorite:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getFavoriteOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch orders where isFavorite is true and userId matches
    const favoriteOrders = await Order.find({ userId: userId, isFavorite: true });

    res.status(200).json({ favoriteOrders });
  } catch (err) {
    console.error('Error fetching favorite orders:', err);
    res.status(500).json({ error: 'Failed to fetch favorite orders' });
  }

};


const updateFavoriteStatus = async (req, res) => {
  const { orderId, isFavorite } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isFavorite: isFavorite },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Favorite status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorite status', error });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  favoriteOrder,
  getOrderById,
  getFavoriteOrders,
  getOrderCount,
  updateFavoriteStatus, 
};
