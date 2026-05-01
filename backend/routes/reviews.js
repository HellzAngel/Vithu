const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review to a product or farmer
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { product, farmer, rating, comment } = req.body;

    if (!product && !farmer) {
      return res.status(400).json({ success: false, message: 'Must review either a product or a farmer' });
    }

    let reviewQuery = { user: req.user._id };
    if (product) reviewQuery.product = product;
    if (farmer) reviewQuery.farmer = farmer;

    const alreadyReviewed = await Review.findOne(reviewQuery);
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this' });
    }

    const review = await Review.create({
      product,
      farmer,
      user: req.user._id,
      rating,
      comment
    });

    // Update averages
    if (product) {
      const Product = require('../models/Product');
      const allProductReviews = await Review.find({ product });
      const avg = allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length;
      await Product.findByIdAndUpdate(product, { rating: avg, numReviews: allProductReviews.length });
    }

    if (farmer) {
      const User = require('../models/User');
      const allFarmerReviews = await Review.find({ farmer });
      const avg = allFarmerReviews.reduce((acc, item) => item.rating + acc, 0) / allFarmerReviews.length;
      await User.findByIdAndUpdate(farmer, { rating: avg, numReviews: allFarmerReviews.length });
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a specific product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
