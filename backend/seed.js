const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedFarmers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const demoFarmers = [
      {
        name: 'Vithu Admin',
        email: 'admin@vithu.com',
        password: 'adminpassword',
        role: 'admin',
        isApproved: true,
        isVerified: true
      },
      {
        name: 'Suresh Kumar',
        email: 'suresh@farm.com',
        password: 'password123',
        role: 'farmer',
        farmName: 'Kumar Organic Greens',
        isApproved: true,
        isVerified: true,
        location: {
          city: 'Thiruvananthapuram',
          pincode: '695001',
          coordinates: { lat: 8.5241, lng: 76.9366 }
        }
      },
      {
        name: 'Mary Joseph',
        email: 'mary@farm.com',
        password: 'password123',
        role: 'farmer',
        farmName: 'Joseph Dairy & Fruits',
        isApproved: true,
        isVerified: true,
        location: {
          city: 'Kochi',
          pincode: '682001',
          coordinates: { lat: 9.9312, lng: 76.2673 }
        }
      },
      {
        name: 'Abdul Rahim',
        email: 'rahim@farm.com',
        password: 'password123',
        role: 'farmer',
        farmName: 'Rahim Spice Garden',
        isApproved: true,
        isVerified: true,
        location: {
          city: 'Kozhikode',
          pincode: '673001',
          coordinates: { lat: 11.2588, lng: 75.7804 }
        }
      }
    ];

    for (const farmerData of demoFarmers) {
      const exists = await User.findOne({ email: farmerData.email });
      if (!exists) {
        await User.create(farmerData);
        console.log(`Created farmer: ${farmerData.farmName}`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFarmers();
