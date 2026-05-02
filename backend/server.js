// ============================================================
// server.js - Main Express Server Entry Point
// ============================================================
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Create uploads folder if missing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB().then(async () => {
  const User = require('./models/User');
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'Vithu Global Admin',
      email: 'vithuadmin',
      password: 'vithu@admin', // Will be hashed by pre-save hook
      role: 'admin',
      isApproved: true,
      isVerified: true
    });
    console.log('🌾 Initialized Default Admin Account');
  }
});

const app = express();

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://vithu-eosin.vercel.app',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/upload',   require('./routes/upload'));

// Health check & Root
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Delveri API running' }));
app.get('/', (req, res) => res.send('🌾 Delveri Backend is Live! Use /api/products or other endpoints.'));

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌾 Delveri server running on http://localhost:${PORT}`));
