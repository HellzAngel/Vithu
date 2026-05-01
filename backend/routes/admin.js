const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/farmers/:id/approve
// @desc    Approve/Reject farmer listing capability
router.put('/farmers/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    user.isApproved = req.body.isApproved;
    await user.save();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('customer', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const farmersCount = await User.countDocuments({ role: 'farmer' });
    const customersCount = await User.countDocuments({ role: 'customer' });
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      success: true,
      stats: {
        users: usersCount,
        farmers: farmersCount,
        customers: customersCount,
        products: productsCount,
        orders: ordersCount,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
