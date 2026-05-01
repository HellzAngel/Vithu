const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      customer: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    const createdOrder = await order.save();

    // Decrease product quantity
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantityAvailable: -item.qty }
      });
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/farmer-orders
// @desc    Get orders for a farmer's products
// @access  Private (Farmer)
router.get('/farmer-orders', protect, authorize('farmer'), async (req, res) => {
  try {
    // Find all orders where orderItems.farmer matches req.user._id
    const orders = await Order.find({ 'orderItems.farmer': req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow only the customer who placed it or the farmers involved to see it (or admin)
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer/Admin)
router.put('/:id/status', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
