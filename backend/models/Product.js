const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true, default: 'kg' }, // kg, piece, bunch, liter
  quantityAvailable: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other']
  },
  images: [{ type: String }], // Array of image URLs/paths
  isOrganic: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
