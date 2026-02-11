const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Search products with advanced filters
// @route   GET /api/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const {
    q = '',
    category,
    occasion,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    sortOrder = 'desc',
    inStock = true,
    page = 1,
    limit = 12,
    tags
  } = req.query;
  
  // Build search query
  const query = {};
  
  // Text search
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }
  
  // Filters
  if (category) query.category = category;
  if (occasion) query.occasion = occasion;
  if (tags) query.tags = { $in: tags.split(',') };
  
  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  // Stock filter
  if (inStock === 'true' || inStock === true) {
    query.stock = { $gt: 0 };
    query.isAvailable = true;
  }
  
  // Determine sort
  let sortOptions = {};
  switch (sortBy) {
    case 'price':
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
      break;
    case 'rating':
      sortOptions.ratings = sortOrder === 'asc' ? 1 : -1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'name':
      sortOptions.name = sortOrder === 'asc' ? 1 : -1;
      break;
    default: // relevance
      sortOptions = { score: { $meta: 'textScore' } };
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  
  // Execute search with or without text score
  let products;
  let total;
  
  if (q) {
    // Text search with scoring
    const results = await Product.aggregate([
      { $match: query },
      {
        $addFields: {
          score: {
            $cond: {
              if: { $regexMatch: { input: '$name', regex: q, options: 'i' } },
              then: 3,
              else: {
                $cond: {
                  if: { $regexMatch: { input: '$description', regex: q, options: 'i' } },
                  then: 2,
                  else: 1
                }
              }
            }
          }
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: Number(limit) }
    ]);
    
    products = results;
    total = await Product.countDocuments(query);
  } else {
    // Regular find without text scoring
    products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
    
    total = await Product.countDocuments(query);
  }
  
  // Get search suggestions
  const suggestions = await getSearchSuggestions(q);
  
  // Get filter options for the current search
  const filterOptions = await getFilterOptions(query);
  
  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    suggestions,
    filterOptions,
    appliedFilters: {
      q,
      category,
      occasion,
      minPrice,
      maxPrice,
      tags,
      sortBy,
      sortOrder
    }
  });
});

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  const suggestions = await Product.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      }
    },
    {
      $group: {
        _id: null,
        names: { $addToSet: '$name' },
        categories: { $addToSet: '$category' },
        tags: { $addToSet: '$tags' }
      }
    },
    {
      $project: {
        allSuggestions: {
          $concatArrays: ['$names', '$categories', { $reduce: {
            input: '$tags',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] }
          }}]
        }
      }
    },
    { $unwind: '$allSuggestions' },
    { $match: { allSuggestions: { $regex: q, $options: 'i' } } },
    { $group: { _id: '$allSuggestions' } },
    { $limit: 10 }
  ]);
  
  res.json(suggestions.map(s => s._id));
});

// Helper function to get filter options
const getFilterOptions = async (query) => {
  const baseQuery = { ...query };
  delete baseQuery.category;
  delete baseQuery.occasion;
  delete baseQuery.price;
  delete baseQuery.tags;
  
  const [categories, occasions, priceRange] = await Promise.all([
    Product.distinct('category', baseQuery),
    Product.distinct('occasion', baseQuery),
    Product.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ])
  ]);
  
  // Get popular tags
  const popularTags = await Product.aggregate([
    { $match: baseQuery },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);
  
  return {
    categories,
    occasions,
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
    popularTags: popularTags.map(tag => ({ name: tag._id, count: tag.count }))
  };
};

// @desc    Get autocomplete results
// @route   GET /api/search/autocomplete
// @access  Public
const autocompleteSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  const results = await Product.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ],
        isAvailable: true
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        category: 1,
        price: 1,
        discountPrice: 1,
        images: { $slice: ['$images', 1] },
        relevance: {
          $cond: [
            { $regexMatch: { input: '$name', regex: `^${q}`, options: 'i' } },
            3,
            {
              $cond: [
                { $regexMatch: { input: '$name', regex: q, options: 'i' } },
                2,
                1
              ]
            }
          ]
        }
      }
    },
    { $sort: { relevance: -1, name: 1 } },
    { $limit: 8 }
  ]);
  
  res.json(results);
});

module.exports = {
  searchProducts,
  getSearchSuggestions,
  autocompleteSearch
};