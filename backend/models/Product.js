// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   discountPrice: {
//     type: Number,
//     min: 0
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['roses', 'lilies', 'tulips', 'orchids', 'mixed', 'seasonal', 'bouquets']
//   },
//   occasion: [{
//     type: String,
//     enum: ['birthday', 'anniversary', 'wedding', 'valentine', 'sympathy', 'congratulations']
//   }],
//   images: [{
//     url: String,
//     public_id: String
//   }],
//   stock: {
//     type: Number,
//     required: true,
//     min: 0,
//     default: 0
//   },
//   tags: [String],
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   ratings: {
//     type: Number,
//     default: 0
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Product', productSchema);



// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Flowers', 'Plants', 'Gifts', 'Chocolates', 'Personalized',
      'Anniversary', 'Birthday', 'Wedding', 'Congratulations', 'Sympathy',
      // Keep old values for backward compatibility
      'roses', 'lilies', 'tulips', 'orchids', 'mixed', 'seasonal', 'bouquets'
    ]
  },
  occasion: [{
    type: String,
    enum: [
      'Birthday', 'Anniversary', 'Valentine\'s Day', 'Mother\'s Day',
      'Wedding', 'Graduation', 'Get Well', 'Sympathy', 'Congratulations',
      'Christmas', 'New Year', 'Corporate',
      // Keep old values for backward compatibility
      'birthday', 'anniversary', 'wedding', 'valentine', 'sympathy', 'congratulations'
    ]
  }],
  images: [{
    url: String,
    public_id: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);