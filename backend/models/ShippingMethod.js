const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  estimatedDays: {
    type: Number,
    required: true,
    min: 1
  },
  isExpedited: {
    type: Boolean,
    default: false
  },
  expeditedFee: {
    type: Number,
    default: 0
  },
  supportedCountries: [{
    type: String,
    default: ['US', 'CA'] // Default supported countries
  }],
  weightLimit: {
    type: Number, // in kg
    default: 20
  },
  dimensionsLimit: {
    height: Number,
    width: Number,
    length: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  processingTime: {
    type: Number, // in hours
    default: 24
  },
  carrier: {
    type: String,
    enum: ['UPS', 'FedEx', 'USPS', 'DHL', 'Custom'],
    default: 'Custom'
  },
  serviceLevel: {
    type: String,
    enum: ['standard', 'expedited', 'overnight', 'same_day'],
    default: 'standard'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before save
shippingMethodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);