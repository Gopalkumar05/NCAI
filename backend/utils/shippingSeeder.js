const ShippingMethod = require('../models/ShippingMethod');
const mongoose = require('mongoose');
 require('dotenv').config();
const shippingMethods = [
  {
    name: 'Standard Shipping',
    description: 'Regular shipping with 5-7 business days delivery',
    price: 4.99,
    basePrice: 4.99,
    estimatedDays: 7,
    isDefault: true,
    carrier: 'USPS',
    serviceLevel: 'standard',
    weightLimit: 10,
    supportedCountries: ['US', 'CA']
  },
  {
    name: 'Express Shipping',
    description: 'Faster delivery in 2-3 business days',
    price: 12.99,
    basePrice: 12.99,
    estimatedDays: 3,
    isExpedited: true,
    expeditedFee: 8.00,
    carrier: 'FedEx',
    serviceLevel: 'expedited',
    weightLimit: 20,
    supportedCountries: ['US', 'CA']
  },
  {
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    price: 24.99,
    basePrice: 24.99,
    estimatedDays: 1,
    isExpedited: true,
    expeditedFee: 20.00,
    carrier: 'UPS',
    serviceLevel: 'overnight',
    weightLimit: 10,
    supportedCountries: ['US']
  },
  {
    name: 'Free Shipping',
    description: 'Free shipping on orders over $50',
    price: 0.00,
    basePrice: 0.00,
    estimatedDays: 7,
    carrier: 'USPS',
    serviceLevel: 'standard',
    weightLimit: 5,
    supportedCountries: ['US'],
    processingTime: 48
  },
  {
    name: 'International Standard',
    description: 'International shipping to select countries',
    price: 29.99,
    basePrice: 29.99,
    estimatedDays: 10,
    carrier: 'DHL',
    serviceLevel: 'standard',
    weightLimit: 5,
    supportedCountries: ['CA', 'UK', 'AU', 'DE', 'FR', 'JP']
  }
];

const seedShippingMethods = async () => {
  try {
    await ShippingMethod.deleteMany({});
    await ShippingMethod.insertMany(shippingMethods);
    console.log('Shipping methods seeded successfully');
  } catch (error) {
    console.error('Error seeding shipping methods:', error);
  }
};

// Run seeder if called directly
if (require.main === module) {
  
  mongoose.connect('mongodb+srv://gk7380494_db_user:jg9VQHtvjJfiAJgO@cluster0.cyhsizn.mongodb.net/')
    .then(() => seedShippingMethods())
    .then(() => mongoose.disconnect())
    .catch(console.error);
}

module.exports = seedShippingMethods;
