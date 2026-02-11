// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   comment: {
//     type: String,
//     required: true
//   },
//   images: [{
//     url: String,
//     public_id: String
//   }],
//   helpful: {
//     type: Number,
//     default: 0
//   },
//   isVerifiedPurchase: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Ensure one review per product per user
// reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// module.exports = mongoose.model('Review', reviewSchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      maxlength: 100
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    images: [{
      url: String,
      publicId: String
    }],
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    lastEdited: Date,
    helpfulVotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }],
    helpfulCount: {
      type: Number,
      default: 0
    },
    reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['inappropriate', 'spam', 'offensive', 'misleading', 'other']
      },
      details: String,
      reportedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'dismissed'],
        default: 'pending'
      }
    }],
    response: {
      type: String,
      maxlength: 1000
    },
    responseDate: Date
  },
  {
    timestamps: true
  }
);

// Index for better query performance
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);