// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { 
// //   ShoppingCart, 
// //   Heart, 
// //   Star, 
// //   Truck, 
// //   Shield, 
// //   ChevronLeft,
// //   Plus,
// //   Minus,
// //   Check
// // } from 'lucide-react';
// // import { productService } from '../../services/productService';
// // import {orderService} from '../../services/orderService'
// // import LoadingSpinner from '../../components/LoadingSpinner';
// // import ReviewForm from '../../components/ReviewForm';

// // const ProductDetail = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [product, setProduct] = useState(null);
// //   const [relatedProducts, setRelatedProducts] = useState([]);
// //   const [reviews, setReviews] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [isInWishlist, setIsInWishlist] = useState(false);
// //   const [addingToCart, setAddingToCart] = useState(false);
// //   const [showReviewForm, setShowReviewForm] = useState(false);

// //   useEffect(() => {
// //     fetchProductDetails();
// //   }, [id]);

// //   const fetchProductDetails = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const response = await productService.getProductById(id);
// //       setProduct(response.data.product);
// //       setRelatedProducts(response.data.relatedProducts || []);
// //       setReviews(response.data.reviews || []);
      
// //       // Check if product is in wishlist
// //       const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
// //       setIsInWishlist(wishlist.includes(id));
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to fetch product details');
// //       console.error('Error fetching product:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleQuantityChange = (action) => {
// //     if (action === 'increment' && quantity < product.stock) {
// //       setQuantity(prev => prev + 1);
// //     } else if (action === 'decrement' && quantity > 1) {
// //       setQuantity(prev => prev - 1);
// //     }
// //   };

// //   const handleAddToCart = async () => {
// //     try {
// //       setAddingToCart(true);
// //       await orderService.addToCart({
// //         productId: id,
// //         quantity
// //       });
      
// //       // Show success message
// //       alert('Product added to cart successfully!');
      
// //       // Reset quantity
// //       setQuantity(1);
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to add to cart');
// //     } finally {
// //       setAddingToCart(false);
// //     }
// //   };

// //   const handleAddToWishlist = () => {
// //     const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
// //     if (isInWishlist) {
// //       const newWishlist = wishlist.filter(item => item !== id);
// //       localStorage.setItem('wishlist', JSON.stringify(newWishlist));
// //       setIsInWishlist(false);
// //     } else {
// //       wishlist.push(id);
// //       localStorage.setItem('wishlist', JSON.stringify(wishlist));
// //       setIsInWishlist(true);
// //     }
// //   };

// //   const handleSubmitReview = async (reviewData) => {
// //     try {
// //       await productService.addReview(id, reviewData);
// //       setShowReviewForm(false);
// //       fetchProductDetails(); // Refresh reviews
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to submit review');
// //     }
// //   };

// //   if (loading) {
// //     return <LoadingSpinner />;
// //   }

// //   if (error || !product) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="text-red-500 text-4xl mb-4">⚠️</div>
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">
// //             {error || 'Product not found'}
// //           </h2>
// //           <button
// //             onClick={() => navigate('/products')}
// //             className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600"
// //           >
// //             Browse Products
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Breadcrumb */}
// //       <div className="bg-white border-b">
// //         <div className="container mx-auto px-4 py-4">
// //           <nav className="flex items-center text-sm text-gray-600">
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="flex items-center hover:text-pink-600"
// //             >
// //               <ChevronLeft className="w-4 h-4 mr-1" />
// //               Back
// //             </button>
// //             <span className="mx-2">/</span>
// //             <button
// //               onClick={() => navigate('/products')}
// //               className="hover:text-pink-600"
// //             >
// //               Products
// //             </button>
// //             <span className="mx-2">/</span>
// //             <button
// //               onClick={() => navigate(`/products?category=${product.category}`)}
// //               className="hover:text-pink-600"
// //             >
// //               {product.category}
// //             </button>
// //             <span className="mx-2">/</span>
// //             <span className="text-gray-900 font-medium">{product.name}</span>
// //           </nav>
// //         </div>
// //       </div>

// //       <div className="container mx-auto px-4 py-8">
// //         <div className="grid lg:grid-cols-2 gap-12">
// //           {/* Product Images */}
// //           <div>
// //             <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
// //               <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-8xl mb-4">
// //                 {product.images?.[selectedImage]?.url ? (
// //                   <img
// //                     src={product.images[selectedImage].url}
// //                     alt={product.name}
// //                     className="w-full h-full object-cover rounded-xl"
// //                   />
// //                 ) : (
// //                   '💐'
// //                 )}
// //               </div>
              
// //               {product.images?.length > 1 && (
// //                 <div className="flex gap-3 overflow-x-auto pb-2">
// //                   {product.images.map((image, index) => (
// //                     <button
// //                       key={index}
// //                       onClick={() => setSelectedImage(index)}
// //                       className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImage === index ? 'border-pink-500' : 'border-gray-200'}`}
// //                     >
// //                       {image.url ? (
// //                         <img
// //                           src={image.url}
// //                           alt={`${product.name} ${index + 1}`}
// //                           className="w-full h-full object-cover"
// //                         />
// //                       ) : (
// //                         <div className="w-full h-full flex items-center justify-center text-2xl">
// //                           🌸
// //                         </div>
// //                       )}
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Features */}
// //             <div className="grid grid-cols-3 gap-4">
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm">
// //                 <Truck className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm text-gray-600">Free Delivery</p>
// //               </div>
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm">
// //                 <Shield className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm text-gray-600">Fresh Guarantee</p>
// //               </div>
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm">
// //                 <Check className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm text-gray-600">Quality Checked</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Product Info */}
// //           <div>
// //             <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //                     {product.name}
// //                   </h1>
// //                   <div className="flex items-center gap-4 mb-4">
// //                     <div className="flex items-center">
// //                       <Star className="w-5 h-5 text-yellow-400 fill-current" />
// //                       <span className="ml-1 font-semibold">{product.ratings}</span>
// //                       <span className="ml-1 text-gray-500">
// //                         ({product.numOfReviews} reviews)
// //                       </span>
// //                     </div>
// //                     <span className="text-gray-400">•</span>
// //                     <span className="text-green-600 font-medium">
// //                       {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={handleAddToWishlist}
// //                   className={`p-3 rounded-full ${isInWishlist ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'}`}
// //                 >
// //                   <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
// //                 </button>
// //               </div>

// //               <div className="text-3xl font-bold text-gray-900 mb-6">
// //                 ${product.discountPrice || product.price}
// //                 {product.discountPrice && (
// //                   <span className="ml-3 text-lg text-gray-500 line-through">
// //                     ${product.price}
// //                   </span>
// //                 )}
// //                 {product.discountPrice && (
// //                   <span className="ml-3 text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
// //                     Save ${(product.price - product.discountPrice).toFixed(2)}
// //                   </span>
// //                 )}
// //               </div>

// //               <p className="text-gray-600 mb-8 leading-relaxed">
// //                 {product.description}
// //               </p>

// //               {/* Tags */}
// //               <div className="mb-8">
// //                 <div className="flex flex-wrap gap-2 mb-4">
// //                   {product.occasion?.map((occ) => (
// //                     <span
// //                       key={occ}
// //                       className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-medium"
// //                     >
// //                       {occ}
// //                     </span>
// //                   ))}
// //                   {product.tags?.map((tag) => (
// //                     <span
// //                       key={tag}
// //                       className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full"
// //                     >
// //                       #{tag}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Quantity and Add to Cart */}
// //               <div className="mb-8">
// //                 <div className="flex items-center gap-6">
// //                   <div className="flex items-center border rounded-full p-1">
// //                     <button
// //                       onClick={() => handleQuantityChange('decrement')}
// //                       className="p-2 text-gray-600 hover:text-pink-600"
// //                       disabled={quantity <= 1}
// //                     >
// //                       <Minus className="w-5 h-5" />
// //                     </button>
// //                     <span className="w-12 text-center font-semibold">
// //                       {quantity}
// //                     </span>
// //                     <button
// //                       onClick={() => handleQuantityChange('increment')}
// //                       className="p-2 text-gray-600 hover:text-pink-600"
// //                       disabled={quantity >= product.stock}
// //                     >
// //                       <Plus className="w-5 h-5" />
// //                     </button>
// //                   </div>
                  
// //                   <div className="flex-1">
// //                     <button
// //                       onClick={handleAddToCart}
// //                       disabled={product.stock === 0 || addingToCart}
// //                       className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
// //                     >
// //                       {addingToCart ? (
// //                         'Adding...'
// //                       ) : (
// //                         <>
// //                           <ShoppingCart className="w-6 h-6 mr-3" />
// //                           {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
// //                         </>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>
                
// //                 {product.stock <= 5 && product.stock > 0 && (
// //                   <div className="mt-4 text-sm text-amber-600">
// //                     ⚠️ Only {product.stock} items left in stock!
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Product Details */}
// //               <div className="border-t pt-6">
// //                 <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <span className="text-gray-600">Category:</span>
// //                     <span className="ml-2 font-medium">{product.category}</span>
// //                   </div>
// //                   <div>
// //                     <span className="text-gray-600">Availability:</span>
// //                     <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
// //                       {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
// //                     </span>
// //                   </div>
// //                   <div>
// //                     <span className="text-gray-600">Delivery:</span>
// //                     <span className="ml-2 font-medium">1-2 Business Days</span>
// //                   </div>
// //                   <div>
// //                     <span className="text-gray-600">Freshness:</span>
// //                     <span className="ml-2 font-medium">7-Day Guarantee</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reviews Section */}
// //         <div className="mt-12">
// //           <div className="bg-white rounded-2xl p-8 shadow-sm">
// //             <div className="flex justify-between items-center mb-8">
// //               <h2 className="text-2xl font-bold text-gray-900">
// //                 Customer Reviews ({product.numOfReviews})
// //               </h2>
// //               <button
// //                 onClick={() => setShowReviewForm(true)}
// //                 className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold"
// //               >
// //                 Write a Review
// //               </button>
// //             </div>

// //             {showReviewForm && (
// //               <div className="mb-8">
// //                 <ReviewForm
// //                   onSubmit={handleSubmitReview}
// //                   onCancel={() => setShowReviewForm(false)}
// //                 />
// //               </div>
// //             )}

// //             {reviews.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <div className="text-6xl mb-4">📝</div>
// //                 <h3 className="text-xl font-bold text-gray-900 mb-2">
// //                   No reviews yet
// //                 </h3>
// //                 <p className="text-gray-600 mb-4">
// //                   Be the first to share your thoughts!
// //                 </p>
// //               </div>
// //             ) : (
// //               <div className="space-y-6">
// //                 {reviews.map((review) => (
// //                   <div key={review._id} className="border-b pb-6 last:border-0">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div>
// //                         <h4 className="font-bold text-gray-900">{review.user?.name}</h4>
// //                         <div className="flex items-center gap-2 mt-1">
// //                           <div className="flex">
// //                             {[...Array(5)].map((_, i) => (
// //                               <Star
// //                                 key={i}
// //                                 className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
// //                               />
// //                             ))}
// //                           </div>
// //                           <span className="text-sm text-gray-500">
// //                             {new Date(review.createdAt).toLocaleDateString()}
// //                           </span>
// //                         </div>
// //                       </div>
// //                       {review.isVerifiedPurchase && (
// //                         <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
// //                           Verified Purchase
// //                         </span>
// //                       )}
// //                     </div>
// //                     <p className="text-gray-700">{review.comment}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Related Products */}
// //         {relatedProducts.length > 0 && (
// //           <div className="mt-12">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-8">
// //               You Might Also Like
// //             </h2>
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //               {relatedProducts.map((relatedProduct) => (
// //                 <div
// //                   key={relatedProduct._id}
// //                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow p-4 cursor-pointer"
// //                   onClick={() => navigate(`/product/${relatedProduct._id}`)}
// //                 >
// //                   <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-4xl">
// //                     {relatedProduct.images?.[0]?.url ? (
// //                       <img
// //                         src={relatedProduct.images[0].url}
// //                         alt={relatedProduct.name}
// //                         className="w-full h-full object-cover rounded-xl"
// //                       />
// //                     ) : (
// //                       '🌸'
// //                     )}
// //                   </div>
// //                   <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
// //                     {relatedProduct.name}
// //                   </h3>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-lg font-bold text-gray-900">
// //                       ${relatedProduct.discountPrice || relatedProduct.price}
// //                     </span>
// //                     <div className="flex items-center">
// //                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
// //                       <span className="ml-1 text-sm">{relatedProduct.ratings}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetail;

// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { 
// //   ShoppingCart, 
// //   Heart, 
// //   Star, 
// //   Truck, 
// //   Shield, 
// //   ChevronLeft,
// //   Plus,
// //   Minus,
// //   Check,
// //   Edit2,
// //   Trash2,
// //   Share2,
// //   Package,
// //   Clock,
// //   Award,
// //   AlertCircle
// // } from 'lucide-react';
// // import { productService } from '../../services/productService';
// // import { orderService } from '../../services/orderService';
// // import { useAuth } from '../../context/AuthContext';
// // import LoadingSpinner from '../../components/LoadingSpinner';
// // import ReviewForm from '../../components/ReviewForm';
// // import ReviewList from '../../components/ReviewList';

// // const ProductDetail = () => {
// //   const { id } = useParams();
// //   const {user} = useAuth();
// //   const navigate = useNavigate();
// //   const [product, setProduct] = useState(null);
// //   const [relatedProducts, setRelatedProducts] = useState([]);
// //   const [reviews, setReviews] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [isInWishlist, setIsInWishlist] = useState(false);
// //   const [addingToCart, setAddingToCart] = useState(false);
// //   const [showReviewForm, setShowReviewForm] = useState(false);
// //   const [editingReview, setEditingReview] = useState(null);
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [showShareModal, setShowShareModal] = useState(false);
// //   const [selectedOccasion, setSelectedOccasion] = useState('');

// //   useEffect(() => {
// //     fetchProductDetails();
// //     checkCurrentUser();
// //   }, [id]);

// //   const checkCurrentUser = () => {
 
// //     setCurrentUser(user);
// //   };

// //   const fetchProductDetails = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const response = await productService.getProductById(id);
// //       setProduct(response.data.product);
// //       setRelatedProducts(response.data.relatedProducts || []);
// //       setReviews(response.data.reviews || []);
      
// //       // Check if product is in wishlist
// //       const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
// //       setIsInWishlist(wishlist.includes(id));
      
// //       // Set first occasion if available
// //       if (response.data.product?.occasion?.length > 0) {
// //         setSelectedOccasion(response.data.product.occasion[0]);
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Failed to fetch product details');
// //       console.error('Error fetching product:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleQuantityChange = (action) => {
// //     if (action === 'increment' && quantity < product.stock) {
// //       setQuantity(prev => prev + 1);
// //     } else if (action === 'decrement' && quantity > 1) {
// //       setQuantity(prev => prev - 1);
// //     }
// //   };

// //   const handleAddToCart = async () => {
// //     if (!currentUser) {
// //       navigate('/login', { state: { from: `/product/${id}` } });
// //       return;
// //     }

// //     try {
// //       setAddingToCart(true);
// //       await orderService.addToCart({
// //         productId: id,
// //         quantity,
// //         selectedOccasion
// //       });
      
// //       // Show success message
// //       alert('Product added to cart successfully!');
      
// //       // Reset quantity
// //       setQuantity(1);
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to add to cart');
// //     } finally {
// //       setAddingToCart(false);
// //     }
// //   };

// //   const handleAddToWishlist = () => {
// //     if (!currentUser) {
// //       navigate('/login', { state: { from: `/product/${id}` } });
// //       return;
// //     }

// //     const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
// //     if (isInWishlist) {
// //       const newWishlist = wishlist.filter(item => item !== id);
// //       localStorage.setItem('wishlist', JSON.stringify(newWishlist));
// //       setIsInWishlist(false);
// //       alert('Removed from wishlist');
// //     } else {
// //       wishlist.push(id);
// //       localStorage.setItem('wishlist', JSON.stringify(wishlist));
// //       setIsInWishlist(true);
// //       alert('Added to wishlist');
// //     }
// //   };

// // //   const handleSubmitReview = async (reviewData) => {
// // //     if (!currentUser) {
// // //       navigate('/login', { state: { from: `/product/${id}` } });
// // //       return;
// // //     }

// // //     try {
// // //       if (editingReview) {
// // //         // Update existing review
// // //         await productService.updateReview(id, editingReview._id, reviewData);
// // //         setEditingReview(null);
// // //       } else {
// // //         // Create new review
// // //         await productService.addReview(id, reviewData);
// // //       }
      
// // //       setShowReviewForm(false);
// // //       fetchProductDetails(); // Refresh reviews
// // //       alert(editingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
// // //     } catch (err) {
// // //       alert(err.response?.data?.message || 'Failed to submit review');
// // //     }
// // //   };

// // const handleSubmitReview = async (reviewData) => {
// //   if (!currentUser) {
// //     navigate('/login', { state: { from: `/product/${id}` } });
// //     return;
// //   }

// //   try {
// //     // Separate uploaded files from URL images
// //     const uploadedImages = reviewData.images
// //       .filter(img => img.type === 'upload' && img.file)
// //       .map(img => img.file);
    
// //     const urlImages = reviewData.images
// //       .filter(img => img.type === 'url')
// //       .map(img => ({ url: img.url, type: 'url' }));
    
// //     // Prepare data without files
// //     const { images, ...reviewDataWithoutImages } = reviewData;
    
// //     if (editingReview) {
// //       // Update existing review
// //       await productService.updateReview(
// //         id, 
// //         editingReview._id, 
// //         { ...reviewDataWithoutImages, images: urlImages },
// //         uploadedImages
// //       );
// //       setEditingReview(null);
// //     } else {
// //       // Create new review
// //       await productService.addReview(
// //         id, 
// //         { ...reviewDataWithoutImages, images: urlImages },
// //         uploadedImages
// //       );
// //     }
    
// //     setShowReviewForm(false);
// //     fetchProductDetails(); // Refresh reviews
// //     alert(editingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
// //   } catch (err) {
// //     alert(err.response?.data?.message || 'Failed to submit review');
// //   }
// // };

// //   const handleEditReview = (review) => {
// //     setEditingReview(review);
// //     setShowReviewForm(true);
// //   };

// //   const handleDeleteReview = async (reviewId) => {
// //     try {
// //       if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
// //         await productService.deleteReview(id, reviewId);
// //         fetchProductDetails(); // Refresh reviews
// //         alert('Review deleted successfully');
// //       }
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to delete review');
// //     }
// //   };

// //   const handleMarkHelpful = async (reviewId) => {
// //     if (!currentUser) {
// //       navigate('/login', { state: { from: `/product/${id}` } });
// //       return;
// //     }

// //     try {
// //       await productService.markReviewHelpful(id, reviewId);
// //       fetchProductDetails(); // Refresh reviews
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Failed to mark review as helpful');
// //     }
// //   };

// //   const handleReportReview = async (reviewId) => {
// //     if (!currentUser) {
// //       navigate('/login', { state: { from: `/product/${id}` } });
// //       return;
// //     }

// //     const reason = prompt('Please enter the reason for reporting this review (inappropriate, spam, offensive, misleading, or other):');
// //     if (reason && ['inappropriate', 'spam', 'offensive', 'misleading', 'other'].includes(reason.toLowerCase())) {
// //       try {
// //         await productService.reportReview(id, reviewId, { reason: reason.toLowerCase() });
// //         alert('Review reported successfully. Our team will review it shortly.');
// //       } catch (err) {
// //         alert(err.response?.data?.message || 'Failed to report review');
// //       }
// //     } else if (reason) {
// //       alert('Please enter a valid reason: inappropriate, spam, offensive, misleading, or other');
// //     }
// //   };

// //   const handleShareProduct = () => {
// //     if (navigator.share) {
// //       navigator.share({
// //         title: product.name,
// //         text: `Check out ${product.name} on BloomBox!`,
// //         url: window.location.href,
// //       })
// //       .catch(console.error);
// //     } else {
// //       navigator.clipboard.writeText(window.location.href);
// //       alert('Link copied to clipboard!');
// //     }
// //   };

// //   const handleOccasionSelect = (occasion) => {
// //     setSelectedOccasion(occasion);
// //   };

// //   const calculateDiscountPercentage = () => {
// //     if (!product.discountPrice) return 0;
// //     return Math.round(((product.price - product.discountPrice) / product.price) * 100);
// //   };

// //   const renderRatingStars = (rating) => {
// //     return (
// //       <div className="flex items-center">
// //         {[...Array(5)].map((_, i) => (
// //           <Star
// //             key={i}
// //             className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
// //           />
// //         ))}
// //         <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <LoadingSpinner size="large" />
// //       </div>
// //     );
// //   }

// //   if (error || !product) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto px-4">
// //           <div className="text-red-500 text-6xl mb-6">⚠️</div>
// //           <h2 className="text-2xl font-bold text-gray-900 mb-3">
// //             {error || 'Product not found'}
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             The product you're looking for might have been removed or is temporarily unavailable.
// //           </p>
// //           <div className="flex flex-col sm:flex-row gap-3 justify-center">
// //             <button
// //               onClick={() => navigate('/products')}
// //               className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold"
// //             >
// //               Browse Products
// //             </button>
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 font-semibold"
// //             >
// //               Go Back
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Breadcrumb */}
// //       <div className="bg-white border-b">
// //         <div className="container mx-auto px-4 py-4">
// //           <nav className="flex items-center text-sm text-gray-600">
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="flex items-center hover:text-pink-600 transition-colors"
// //             >
// //               <ChevronLeft className="w-4 h-4 mr-1" />
// //               Back
// //             </button>
// //             <span className="mx-2">/</span>
// //             <button
// //               onClick={() => navigate('/products')}
// //               className="hover:text-pink-600 transition-colors"
// //             >
// //               Products
// //             </button>
// //             <span className="mx-2">/</span>
// //             <button
// //               onClick={() => navigate(`/products?category=${product.category}`)}
// //               className="hover:text-pink-600 transition-colors"
// //             >
// //               {product.category}
// //             </button>
// //             <span className="mx-2">/</span>
// //             <span className="text-gray-900 font-medium truncate max-w-xs">
// //               {product.name}
// //             </span>
// //           </nav>
// //         </div>
// //       </div>

// //       <div className="container mx-auto px-4 py-8">
// //         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
// //           {/* Product Images */}
// //           <div className="space-y-6">
// //             <div className="bg-white rounded-2xl p-6 shadow-sm">
// //               <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center overflow-hidden mb-4 relative">
// //                 {product.images?.[selectedImage]?.url ? (
// //                   <img
// //                     src={product.images[selectedImage].url}
// //                     alt={product.name}
// //                     className="w-full h-full object-contain p-4"
// //                   />
// //                 ) : (
// //                   <div className="text-8xl">💐</div>
// //                 )}
                
// //                 {/* Discount Badge */}
// //                 {product.discountPrice && (
// //                   <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
// //                     {calculateDiscountPercentage()}% OFF
// //                   </div>
// //                 )}
                
// //                 {/* Share Button */}
// //                 <button
// //                   onClick={handleShareProduct}
// //                   className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-lg"
// //                 >
// //                   <Share2 className="w-5 h-5 text-gray-700" />
// //                 </button>
// //               </div>
              
// //               {/* Image Thumbnails */}
// //               {product.images?.length > 1 && (
// //                 <div className="flex gap-3 overflow-x-auto pb-2">
// //                   {product.images.map((image, index) => (
// //                     <button
// //                       key={index}
// //                       onClick={() => setSelectedImage(index)}
// //                       className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index ? 'border-pink-500 shadow-md scale-105' : 'border-gray-200 hover:border-pink-300'}`}
// //                     >
// //                       {image.url ? (
// //                         <img
// //                           src={image.url}
// //                           alt={`${product.name} ${index + 1}`}
// //                           className="w-full h-full object-cover"
// //                         />
// //                       ) : (
// //                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-2xl">
// //                           🌸
// //                         </div>
// //                       )}
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Features */}
// //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
// //                 <Truck className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm font-medium text-gray-900">Free Delivery</p>
// //                 <p className="text-xs text-gray-500">Order over $50</p>
// //               </div>
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
// //                 <Shield className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm font-medium text-gray-900">Fresh Guarantee</p>
// //                 <p className="text-xs text-gray-500">7-day freshness</p>
// //               </div>
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
// //                 <Package className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm font-medium text-gray-900">Gift Ready</p>
// //                 <p className="text-xs text-gray-500">Free gift wrap</p>
// //               </div>
// //               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
// //                 <Clock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
// //                 <p className="text-sm font-medium text-gray-900">Same Day</p>
// //                 <p className="text-xs text-gray-500">Delivery available</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Product Info */}
// //           <div>
// //             <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mb-6">
// //               <div className="flex justify-between items-start mb-4">
// //                 <div className="flex-1">
// //                   <div className="flex items-center gap-2 mb-2">
// //                     <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
// //                       {product.category}
// //                     </span>
// //                     {product.isFeatured && (
// //                       <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
// //                         Featured
// //                       </span>
// //                     )}
// //                   </div>
// //                   <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
// //                     {product.name}
// //                   </h1>
// //                   <div className="flex items-center gap-4 mb-4">
// //                     <div className="flex items-center">
// //                       {renderRatingStars(product.ratings || 0)}
// //                       <span className="ml-1 text-gray-500">
// //                         ({product.numOfReviews || 0} reviews)
// //                       </span>
// //                     </div>
// //                     <span className="text-gray-300">•</span>
// //                     <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
// //                       {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={handleAddToWishlist}
// //                   className={`p-3 rounded-full transition-all ${isInWishlist ? 'bg-pink-100 text-pink-600 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'}`}
// //                   title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
// //                 >
// //                   <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
// //                 </button>
// //               </div>

// //               {/* Price */}
// //               <div className="mb-6">
// //                 <div className="flex items-center gap-3 mb-2">
// //                   <span className="text-3xl font-bold text-gray-900">
// //                     ${product.discountPrice || product.price}
// //                   </span>
// //                   {product.discountPrice && (
// //                     <>
// //                       <span className="text-xl text-gray-500 line-through">
// //                         ${product.price}
// //                       </span>
// //                       <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
// //                         Save ${(product.price - product.discountPrice).toFixed(2)}
// //                       </span>
// //                     </>
// //                   )}
// //                 </div>
// //                 {product.discountPrice && (
// //                   <p className="text-sm text-gray-500">
// //                     {calculateDiscountPercentage()}% discount applied
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Description */}
// //               <div className="mb-6">
// //                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
// //                   {product.description}
// //                 </p>
// //               </div>

// //               {/* Occasions */}
// //               {product.occasion && product.occasion.length > 0 && (
// //                 <div className="mb-6">
// //                   <h3 className="text-sm font-medium text-gray-700 mb-3">Perfect For:</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {product.occasion.map((occasion) => (
// //                       <button
// //                         key={occasion}
// //                         onClick={() => handleOccasionSelect(occasion)}
// //                         className={`px-4 py-2 rounded-full transition-all ${selectedOccasion === occasion ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// //                       >
// //                         {occasion}
// //                       </button>
// //                     ))}
// //                   </div>
// //                   {selectedOccasion && (
// //                     <p className="text-sm text-gray-500 mt-2">
// //                       Selected for: <span className="font-medium">{selectedOccasion}</span>
// //                     </p>
// //                   )}
// //                 </div>
// //               )}

// //               {/* Care Instructions */}
// //               {product.careInstructions && (
// //                 <div className="mb-6 p-4 bg-blue-50 rounded-lg">
// //                   <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
// //                     <Award className="w-4 h-4" />
// //                     Care Instructions
// //                   </h3>
// //                   <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
// //                     {product.careInstructions.map((instruction, idx) => (
// //                       <li key={idx}>{instruction}</li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //               )}

// //               {/* Quantity and Add to Cart */}
// //               <div className="mb-6">
// //                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// //                   <div className="flex items-center border-2 border-gray-200 rounded-full p-1">
// //                     <button
// //                       onClick={() => handleQuantityChange('decrement')}
// //                       className="p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       disabled={quantity <= 1}
// //                     >
// //                       <Minus className="w-5 h-5" />
// //                     </button>
// //                     <span className="w-16 text-center font-bold text-lg">
// //                       {quantity}
// //                     </span>
// //                     <button
// //                       onClick={() => handleQuantityChange('increment')}
// //                       className="p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       disabled={quantity >= product.stock}
// //                     >
// //                       <Plus className="w-5 h-5" />
// //                     </button>
// //                   </div>
                  
// //                   <div className="flex-1 w-full">
// //                     <button
// //                       onClick={handleAddToCart}
// //                       disabled={product.stock === 0 || addingToCart}
// //                       className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center transition-all ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl'}`}
// //                     >
// //                       {addingToCart ? (
// //                         <>
// //                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
// //                           Adding...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <ShoppingCart className="w-6 h-6 mr-3" />
// //                           {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
// //                         </>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>
                
// //                 {product.stock <= 5 && product.stock > 0 && (
// //                   <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
// //                     <AlertCircle className="w-4 h-4" />
// //                     Only {product.stock} item{product.stock > 1 ? 's' : ''} left in stock!
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Product Details */}
// //               <div className="border-t pt-6">
// //                 <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Category:</span>
// //                       <span className="font-medium">{product.category}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">SKU:</span>
// //                       <span className="font-medium">{product.sku || 'BB-' + product._id.slice(-8)}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Freshness:</span>
// //                       <span className="font-medium">7-Day Guarantee</span>
// //                     </div>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Delivery:</span>
// //                       <span className="font-medium">1-2 Business Days</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Best Seller:</span>
// //                       <span className="font-medium">{product.isBestSeller ? 'Yes' : 'No'}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Return Policy:</span>
// //                       <span className="font-medium">30-Day Return</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reviews Section */}
// //         <div className="mt-12">
// //           <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
// //                   Customer Reviews ({product.numOfReviews || 0})
// //                 </h2>
// //                 <div className="flex items-center gap-3">
// //                   <div className="flex items-center">
// //                     <Star className="w-5 h-5 text-yellow-400 fill-current" />
// //                     <span className="ml-1 text-lg font-bold">{product.ratings?.toFixed(1) || '0.0'}</span>
// //                   </div>
// //                   <span className="text-gray-500">out of 5</span>
// //                 </div>
// //               </div>
              
// //               {currentUser ? (
// //                 <button
// //                   onClick={() => {
// //                     setEditingReview(null);
// //                     setShowReviewForm(!showReviewForm);
// //                   }}
// //                   className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold transition-colors"
// //                 >
// //                   {showReviewForm ? 'Cancel Review' : 'Write a Review'}
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={() => navigate('/login', { state: { from: `/product/${id}` } })}
// //                   className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 font-semibold transition-colors"
// //                 >
// //                   Login to Review
// //                 </button>
// //               )}
// //             </div>

// //             {showReviewForm && (
// //               <div className="mb-8">
// //                 <ReviewForm
// //                   onSubmit={handleSubmitReview}
// //                   onCancel={() => {
// //                     setShowReviewForm(false);
// //                     setEditingReview(null);
// //                   }}
// //                   productName={product.name}
// //                   initialData={editingReview}
// //                   isEditMode={!!editingReview}
// //                 />
// //               </div>
// //             )}

// //             <ReviewList
// //               reviews={reviews}
// //               onHelpfulClick={handleMarkHelpful}
// //               onReportClick={handleReportReview}
// //               onEditClick={handleEditReview}
// //               onDeleteClick={handleDeleteReview}
// //               currentUserId={currentUser?._id}
// //             />
// //           </div>
// //         </div>

// //         {/* Related Products */}
// //         {relatedProducts.length > 0 && (
// //           <div className="mt-12">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-8">
// //               You Might Also Like
// //             </h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //               {relatedProducts.map((relatedProduct) => (
// //                 <div
// //                   key={relatedProduct._id}
// //                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
// //                   onClick={() => navigate(`/product/${relatedProduct._id}`)}
// //                 >
// //                   <div className="relative overflow-hidden">
// //                     <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
// //                       {relatedProduct.images?.[0]?.url ? (
// //                         <img
// //                           src={relatedProduct.images[0].url}
// //                           alt={relatedProduct.name}
// //                           className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
// //                         />
// //                       ) : (
// //                         <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
// //                           🌸
// //                         </div>
// //                       )}
// //                     </div>
                    
// //                     {/* Quick view badge */}
// //                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
// //                       <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium">
// //                         View Details
// //                       </div>
// //                     </div>
                    
// //                     {/* Discount badge */}
// //                     {relatedProduct.discountPrice && (
// //                       <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
// //                         SALE
// //                       </div>
// //                     )}
// //                   </div>
                  
// //                   <div className="p-4">
// //                     <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
// //                       {relatedProduct.name}
// //                     </h3>
// //                     <div className="flex justify-between items-center">
// //                       <div>
// //                         <span className="text-lg font-bold text-gray-900">
// //                           ${relatedProduct.discountPrice || relatedProduct.price}
// //                         </span>
// //                         {relatedProduct.discountPrice && (
// //                           <span className="ml-2 text-sm text-gray-500 line-through">
// //                             ${relatedProduct.price}
// //                           </span>
// //                         )}
// //                       </div>
// //                       <div className="flex items-center">
// //                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
// //                         <span className="ml-1 text-sm font-medium">
// //                           {relatedProduct.ratings?.toFixed(1) || '0.0'}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
            
// //             {/* View All Button */}
// //             <div className="text-center mt-8">
// //               <button
// //                 onClick={() => navigate(`/products?category=${product.category}`)}
// //                 className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 font-semibold transition-colors"
// //               >
// //                 View All in {product.category}
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* FAQ Section */}
// //         <div className="mt-12">
// //           <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
// //             <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
// //             <div className="space-y-4">
// //               <div className="border-b pb-4">
// //                 <h3 className="font-semibold text-gray-900 mb-2">How fresh are the flowers?</h3>
// //                 <p className="text-gray-600">All our flowers are sourced daily from local growers and delivered within 24-48 hours of cutting. We guarantee freshness for 7 days.</p>
// //               </div>
// //               <div className="border-b pb-4">
// //                 <h3 className="font-semibold text-gray-900 mb-2">Can I schedule delivery?</h3>
// //                 <p className="text-gray-600">Yes! During checkout, you can select your preferred delivery date up to 30 days in advance.</p>
// //               </div>
// //               <div className="border-b pb-4">
// //                 <h3 className="font-semibold text-gray-900 mb-2">What's your return policy?</h3>
// //                 <p className="text-gray-600">We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, we'll replace it or provide a full refund.</p>
// //               </div>
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 mb-2">Do you deliver to my area?</h3>
// //                 <p className="text-gray-600">We deliver to all major cities within the continental US. Enter your ZIP code during checkout to check availability.</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetail;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ShoppingCart, 
//   Heart, 
//   Star, 
//   Truck, 
//   Shield, 
//   ChevronLeft,
//   Plus,
//   Minus,
//   Check,
//   Edit2,
//   Trash2,
//   Share2,
//   Package,
//   Clock,
//   Award,
//   AlertCircle
// } from 'lucide-react';
// import { productService } from '../../services/productService';
// import { orderService } from '../../services/orderService';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import ReviewForm from '../../components/ReviewForm';
// import ReviewList from '../../components/ReviewList';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [editingReview, setEditingReview] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [selectedOccasion, setSelectedOccasion] = useState('');
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [filteredReviews, setFilteredReviews] = useState([]);
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [filter, setFilter] = useState('');

//   useEffect(() => {
//     fetchProductDetails();
//     fetchReviews();
//     checkWishlistStatus();
//   }, [id]);

//   useEffect(() => {
//     if (reviews.length > 0) {
//       applyFiltersAndSort();
//     }
//   }, [reviews, sortBy, filter]);

//   const checkWishlistStatus = () => {
//     const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
//     setIsInWishlist(wishlist.includes(id));
//   };

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await productService.getProductById(id);
//       setProduct(response.data.product);
//       setRelatedProducts(response.data.relatedProducts || []);
//       setReviews(response.data.reviews || []);
      
//       // Set first occasion if available
//       if (response.data.product?.occasion?.length > 0) {
//         setSelectedOccasion(response.data.product.occasion[0]);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch product details');
//       console.error('Error fetching product:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       setReviewsLoading(true);
//       const response = await productService.getProductReviews(id);
//       setReviews(response.data);
//     } catch (err) {
//       console.error('Error fetching reviews:', err);
//     } finally {
//       setReviewsLoading(false);
//     }
//   };

//   const applyFiltersAndSort = () => {
//     let result = [...reviews];

//     // Apply filter
//     if (filter === 'verified') {
//       result = result.filter(review => review.isVerifiedPurchase);
//     } else if (filter && ['1', '2', '3', '4', '5'].includes(filter)) {
//       result = result.filter(review => review.rating === parseInt(filter));
//     }

//     // Apply sort
//     result.sort((a, b) => {
//       switch (sortBy) {
//         case 'rating':
//           return b.rating - a.rating;
//         case 'helpfulCount':
//           return (b.helpfulCount || 0) - (a.helpfulCount || 0);
//         case 'createdAt':
//         default:
//           return new Date(b.createdAt) - new Date(a.createdAt);
//       }
//     });

//     setFilteredReviews(result);
//   };

//   const handleQuantityChange = (action) => {
//     if (!product) return;
    
//     if (action === 'increment' && quantity < product.stock) {
//       setQuantity(prev => prev + 1);
//     } else if (action === 'decrement' && quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       navigate('/login', { state: { from: `/product/${id}` } });
//       return;
//     }

//     try {
//       setAddingToCart(true);
//       await orderService.addToCart({
//         productId: id,
//         quantity,
//         selectedOccasion
//       });
      
//       alert('Product added to cart successfully!');
//       setQuantity(1);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add to cart');
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   const handleAddToWishlist = () => {
//     if (!user) {
//       navigate('/login', { state: { from: `/product/${id}` } });
//       return;
//     }

//     const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
//     if (isInWishlist) {
//       const newWishlist = wishlist.filter(item => item !== id);
//       localStorage.setItem('wishlist', JSON.stringify(newWishlist));
//       setIsInWishlist(false);
//       alert('Removed from wishlist');
//     } else {
//       wishlist.push(id);
//       localStorage.setItem('wishlist', JSON.stringify(wishlist));
//       setIsInWishlist(true);
//       alert('Added to wishlist');
//     }
//   };

//   const handleSubmitReview = async (formData) => {
//     if (!user) {
//       navigate('/login', { state: { from: `/product/${id}` } });
//       return;
//     }

//     try {
//       if (editingReview) {
//         await productService.updateReview(id, editingReview._id, formData);
//         setEditingReview(null);
//       } else {
//         await productService.addReview(id, formData);
//       }
      
//       setShowReviewForm(false);
//       fetchProductDetails(); // Refresh product data including reviews
//       alert(editingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to submit review');
//     }
//   };

//   const handleEditReview = (review) => {
//     setEditingReview(review);
//     setShowReviewForm(true);
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await productService.deleteReview(id, reviewId);
//       fetchProductDetails(); // Refresh product data including reviews
//       alert('Review deleted successfully');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete review');
//     }
//   };

//   const handleMarkHelpful = async (reviewId) => {
//     if (!user) {
//       navigate('/login', { state: { from: `/product/${id}` } });
//       return;
//     }

//     try {
//       await productService.markReviewHelpful(id, reviewId);
//       // Update local state optimistically
//       setReviews(prevReviews => 
//         prevReviews.map(review => {
//           if (review._id === reviewId) {
//             return {
//               ...review,
//               helpfulCount: (review.helpfulCount || 0) + 1
//             };
//           }
//           return review;
//         })
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to mark review as helpful');
//     }
//   };

//   const handleReportReview = async (reviewId) => {
//     if (!user) {
//       navigate('/login', { state: { from: `/product/${id}` } });
//       return;
//     }

//     const reason = prompt('Please enter the reason for reporting this review (inappropriate, spam, offensive, misleading, or other):');
//     if (reason && ['inappropriate', 'spam', 'offensive', 'misleading', 'other'].includes(reason.toLowerCase())) {
//       try {
//         await productService.reportReview(id, reviewId, { reason: reason.toLowerCase() });
//         alert('Review reported successfully. Our team will review it shortly.');
//       } catch (err) {
//         alert(err.response?.data?.message || 'Failed to report review');
//       }
//     } else if (reason) {
//       alert('Please enter a valid reason: inappropriate, spam, offensive, misleading, or other');
//     }
//   };

//   const handleShareProduct = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: `Check out ${product.name} on BloomBox!`,
//         url: window.location.href,
//       }).catch(console.error);
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   const handleOccasionSelect = (occasion) => {
//     setSelectedOccasion(occasion);
//   };

//   const calculateDiscountPercentage = () => {
//     if (!product?.discountPrice) return 0;
//     return Math.round(((product.price - product.discountPrice) / product.price) * 100);
//   };

//   const renderRatingStars = (rating) => {
//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
//           />
//         ))}
//         <span className="ml-2 text-sm font-medium">{rating?.toFixed(1) || '0.0'}</span>
//       </div>
//     );
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <LoadingSpinner size="large" />
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="text-red-500 text-6xl mb-6">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">
//             {error || 'Product not found'}
//           </h2>
//           <p className="text-gray-600 mb-6">
//             The product you're looking for might have been removed or is temporarily unavailable.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <button
//               onClick={() => navigate('/products')}
//               className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold"
//             >
//               Browse Products
//             </button>
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 font-semibold"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Breadcrumb */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <nav className="flex items-center text-sm text-gray-600">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center hover:text-pink-600 transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4 mr-1" />
//               Back
//             </button>
//             <span className="mx-2">/</span>
//             <button
//               onClick={() => navigate('/products')}
//               className="hover:text-pink-600 transition-colors"
//             >
//               Products
//             </button>
//             <span className="mx-2">/</span>
//             <button
//               onClick={() => navigate(`/products?category=${product.category}`)}
//               className="hover:text-pink-600 transition-colors"
//             >
//               {product.category}
//             </button>
//             <span className="mx-2">/</span>
//             <span className="text-gray-900 font-medium truncate max-w-xs">
//               {product.name}
//             </span>
//           </nav>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Product Images */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-2xl p-6 shadow-sm">
//               <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center overflow-hidden mb-4 relative">
//                 {product.images?.[selectedImage]?.url ? (
//                   <img
//                     src={product.images[selectedImage].url}
//                     alt={product.name}
//                     className="w-full h-full object-contain p-4"
//                   />
//                 ) : (
//                   <div className="text-8xl">💐</div>
//                 )}
                
//                 {/* Discount Badge */}
//                 {product.discountPrice && (
//                   <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
//                     {calculateDiscountPercentage()}% OFF
//                   </div>
//                 )}
                
//                 {/* Share Button */}
//                 <button
//                   onClick={handleShareProduct}
//                   className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-lg"
//                 >
//                   <Share2 className="w-5 h-5 text-gray-700" />
//                 </button>
//               </div>
              
//               {/* Image Thumbnails */}
//               {product.images?.length > 1 && (
//                 <div className="flex gap-3 overflow-x-auto pb-2">
//                   {product.images.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSelectedImage(index)}
//                       className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index ? 'border-pink-500 shadow-md scale-105' : 'border-gray-200 hover:border-pink-300'}`}
//                     >
//                       {image.url ? (
//                         <img
//                           src={image.url}
//                           alt={`${product.name} ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100 text-2xl">
//                           🌸
//                         </div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                 <Truck className="w-8 h-8 text-pink-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900">Free Delivery</p>
//                 <p className="text-xs text-gray-500">Order over $50</p>
//               </div>
//               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                 <Shield className="w-8 h-8 text-pink-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900">Fresh Guarantee</p>
//                 <p className="text-xs text-gray-500">7-day freshness</p>
//               </div>
//               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                 <Package className="w-8 h-8 text-pink-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900">Gift Ready</p>
//                 <p className="text-xs text-gray-500">Free gift wrap</p>
//               </div>
//               <div className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                 <Clock className="w-8 h-8 text-pink-500 mx-auto mb-2" />
//                 <p className="text-sm font-medium text-gray-900">Same Day</p>
//                 <p className="text-xs text-gray-500">Delivery available</p>
//               </div>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div>
//             <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mb-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
//                       {product.category}
//                     </span>
//                     {product.isFeatured && (
//                       <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
//                         Featured
//                       </span>
//                     )}
//                   </div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
//                     {product.name}
//                   </h1>
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="flex items-center">
//                       {renderRatingStars(product.ratings || 0)}
//                       <span className="ml-1 text-gray-500">
//                         ({product.numOfReviews || 0} reviews)
//                       </span>
//                     </div>
//                     <span className="text-gray-300">•</span>
//                     <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                       {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleAddToWishlist}
//                   className={`p-3 rounded-full transition-all ${isInWishlist ? 'bg-pink-100 text-pink-600 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'}`}
//                   title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//                 >
//                   <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
//                 </button>
//               </div>

//               {/* Price */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="text-3xl font-bold text-gray-900">
//                     ${product.discountPrice || product.price}
//                   </span>
//                   {product.discountPrice && (
//                     <>
//                       <span className="text-xl text-gray-500 line-through">
//                         ${product.price}
//                       </span>
//                       <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
//                         Save ${(product.price - product.discountPrice).toFixed(2)}
//                       </span>
//                     </>
//                   )}
//                 </div>
//                 {product.discountPrice && (
//                   <p className="text-sm text-gray-500">
//                     {calculateDiscountPercentage()}% discount applied
//                   </p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mb-6">
//                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                   {product.description}
//                 </p>
//               </div>

//               {/* Occasions */}
//               {product.occasion && product.occasion.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-3">Perfect For:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {product.occasion.map((occasion) => (
//                       <button
//                         key={occasion}
//                         onClick={() => handleOccasionSelect(occasion)}
//                         className={`px-4 py-2 rounded-full transition-all ${selectedOccasion === occasion ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                       >
//                         {occasion}
//                       </button>
//                     ))}
//                   </div>
//                   {selectedOccasion && (
//                     <p className="text-sm text-gray-500 mt-2">
//                       Selected for: <span className="font-medium">{selectedOccasion}</span>
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Care Instructions */}
//               {product.careInstructions && (
//                 <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                   <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
//                     <Award className="w-4 h-4" />
//                     Care Instructions
//                   </h3>
//                   <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
//                     {product.careInstructions.map((instruction, idx) => (
//                       <li key={idx}>{instruction}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Quantity and Add to Cart */}
//               <div className="mb-6">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="flex items-center border-2 border-gray-200 rounded-full p-1">
//                     <button
//                       onClick={() => handleQuantityChange('decrement')}
//                       className="p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={quantity <= 1}
//                     >
//                       <Minus className="w-5 h-5" />
//                     </button>
//                     <span className="w-16 text-center font-bold text-lg">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => handleQuantityChange('increment')}
//                       className="p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={quantity >= product.stock}
//                     >
//                       <Plus className="w-5 h-5" />
//                     </button>
//                   </div>
                  
//                   <div className="flex-1 w-full">
//                     <button
//                       onClick={handleAddToCart}
//                       disabled={product.stock === 0 || addingToCart || !user}
//                       className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center transition-all ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl'}`}
//                     >
//                       {addingToCart ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
//                           Adding...
//                         </>
//                       ) : !user ? (
//                         'Login to Purchase'
//                       ) : (
//                         <>
//                           <ShoppingCart className="w-6 h-6 mr-3" />
//                           {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
                
//                 {product.stock <= 5 && product.stock > 0 && (
//                   <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
//                     <AlertCircle className="w-4 h-4" />
//                     Only {product.stock} item{product.stock > 1 ? 's' : ''} left in stock!
//                   </div>
//                 )}
//               </div>

//               {/* Product Details */}
//               <div className="border-t pt-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Category:</span>
//                       <span className="font-medium">{product.category}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">SKU:</span>
//                       <span className="font-medium">{product.sku || 'BB-' + product._id.slice(-8)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Freshness:</span>
//                       <span className="font-medium">7-Day Guarantee</span>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Delivery:</span>
//                       <span className="font-medium">1-2 Business Days</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Best Seller:</span>
//                       <span className="font-medium">{product.isBestSeller ? 'Yes' : 'No'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Return Policy:</span>
//                       <span className="font-medium">30-Day Return</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Reviews Section */}
//         <div className="mt-12">
//           <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   Customer Reviews ({product.numOfReviews || 0})
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center">
//                     <Star className="w-5 h-5 text-yellow-400 fill-current" />
//                     <span className="ml-1 text-lg font-bold">{product.ratings?.toFixed(1) || '0.0'}</span>
//                   </div>
//                   <span className="text-gray-500">out of 5</span>
//                 </div>
//               </div>
              
//               {user ? (
//                 <button
//                   onClick={() => {
//                     setEditingReview(null);
//                     setShowReviewForm(!showReviewForm);
//                   }}
//                   className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold transition-colors"
//                 >
//                   {showReviewForm ? 'Cancel Review' : 'Write a Review'}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => navigate('/login', { state: { from: `/product/${id}` } })}
//                   className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 font-semibold transition-colors"
//                 >
//                   Login to Review
//                 </button>
//               )}
//             </div>

//             {/* Review Filters and Sort */}
//             <div className="flex flex-wrap gap-4 mb-6">
//               <select 
//                 value={sortBy}
//                 onChange={handleSortChange}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//               >
//                 <option value="createdAt">Most Recent</option>
//                 <option value="rating">Highest Rated</option>
//                 <option value="helpfulCount">Most Helpful</option>
//               </select>
              
//               <select 
//                 value={filter}
//                 onChange={handleFilterChange}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//               >
//                 <option value="">All Reviews</option>
//                 <option value="5">5 Stars</option>
//                 <option value="4">4 Stars</option>
//                 <option value="3">3 Stars</option>
//                 <option value="2">2 Stars</option>
//                 <option value="1">1 Star</option>
//                 <option value="verified">Verified Purchases</option>
//               </select>
//             </div>

//             {showReviewForm && (
//               <div className="mb-8">
//                 <ReviewForm
//                   onSubmit={handleSubmitReview}
//                   onCancel={() => {
//                     setShowReviewForm(false);
//                     setEditingReview(null);
//                   }}
//                   productName={product.name}
//                   initialData={editingReview}
//                   isEditMode={!!editingReview}
//                 />
//               </div>
//             )}

//             {reviewsLoading ? (
//               <div className="text-center py-8">
//                 <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading reviews...</p>
//               </div>
//             ) : (
//               <ReviewList
//                 reviews={filteredReviews}
//                 onHelpfulClick={handleMarkHelpful}
//                 onReportClick={handleReportReview}
//                 onEditClick={handleEditReview}
//                 onDeleteClick={handleDeleteReview}
//                 currentUserId={user?._id}
//               />
//             )}
//           </div>
//         </div>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-900 mb-8">
//               You Might Also Like
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {relatedProducts.map((relatedProduct) => (
//                 <div
//                   key={relatedProduct._id}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
//                   onClick={() => navigate(`/product/${relatedProduct._id}`)}
//                 >
//                   <div className="relative overflow-hidden">
//                     <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
//                       {relatedProduct.images?.[0]?.url ? (
//                         <img
//                           src={relatedProduct.images[0].url}
//                           alt={relatedProduct.name}
//                           className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
//                         />
//                       ) : (
//                         <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
//                           🌸
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Quick view badge */}
//                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium">
//                         View Details
//                       </div>
//                     </div>
                    
//                     {/* Discount badge */}
//                     {relatedProduct.discountPrice && (
//                       <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
//                         SALE
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="p-4">
//                     <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
//                       {relatedProduct.name}
//                     </h3>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <span className="text-lg font-bold text-gray-900">
//                           ${relatedProduct.discountPrice || relatedProduct.price}
//                         </span>
//                         {relatedProduct.discountPrice && (
//                           <span className="ml-2 text-sm text-gray-500 line-through">
//                             ${relatedProduct.price}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center">
//                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="ml-1 text-sm font-medium">
//                           {relatedProduct.ratings?.toFixed(1) || '0.0'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* View All Button */}
//             <div className="text-center mt-8">
//               <button
//                 onClick={() => navigate(`/products?category=${product.category}`)}
//                 className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 font-semibold transition-colors"
//               >
//                 View All in {product.category}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* FAQ Section */}
//         <div className="mt-12">
//           <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
//             <div className="space-y-4">
//               <div className="border-b pb-4">
//                 <h3 className="font-semibold text-gray-900 mb-2">How fresh are the flowers?</h3>
//                 <p className="text-gray-600">All our flowers are sourced daily from local growers and delivered within 24-48 hours of cutting. We guarantee freshness for 7 days.</p>
//               </div>
//               <div className="border-b pb-4">
//                 <h3 className="font-semibold text-gray-900 mb-2">Can I schedule delivery?</h3>
//                 <p className="text-gray-600">Yes! During checkout, you can select your preferred delivery date up to 30 days in advance.</p>
//               </div>
//               <div className="border-b pb-4">
//                 <h3 className="font-semibold text-gray-900 mb-2">What's your return policy?</h3>
//                 <p className="text-gray-600">We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, we'll replace it or provide a full refund.</p>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-2">Do you deliver to my area?</h3>
//                 <p className="text-gray-600">We deliver to all major cities within the continental US. Enter your ZIP code during checkout to check availability.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-900">Share this product</h3>
//               <button
//                 onClick={() => setShowShareModal(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <button
//                 onClick={handleShareProduct}
//                 className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600"
//               >
//                 Share via...
//               </button>
//               <button
//                 onClick={() => {
//                   navigator.clipboard.writeText(window.location.href);
//                   alert('Link copied to clipboard!');
//                   setShowShareModal(false);
//                 }}
//                 className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
//               >
//                 Copy Link
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetail;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  ChevronLeft,
  Plus,
  Minus,
  Check,
  Edit2,
  Trash2,
  Share2,
  Package,
  Clock,
  Award,
  AlertCircle,
  X,
  CheckCircle,
  Copy
} from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [filter, setFilter] = useState('');
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    checkWishlistStatus();
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      applyFiltersAndSort();
    }
  }, [reviews, sortBy, filter]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const showModal = (title, message, type = 'info', onConfirm = null, confirmText = 'Confirm') => {
    setModal({
      title,
      message,
      type,
      onConfirm,
      confirmText
    });
  };

  const closeModal = () => {
    setModal(null);
  };

  const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(id));
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductById(id);
      setProduct(response.data.product);
      setRelatedProducts(response.data.relatedProducts || []);
      setReviews(response.data.reviews || []);
      
      if (response.data.product?.occasion?.length > 0) {
        setSelectedOccasion(response.data.product.occasion[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await productService.getProductReviews(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...reviews];

    if (filter === 'verified') {
      result = result.filter(review => review.isVerifiedPurchase);
    } else if (filter && ['1', '2', '3', '4', '5'].includes(filter)) {
      result = result.filter(review => review.rating === parseInt(filter));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpfulCount':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredReviews(result);
  };

  const handleQuantityChange = (action) => {
    if (!product) return;
    
    if (action === 'increment' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      setAddingToCart(true);
      await orderService.addToCart({
        productId: id,
        quantity,
        selectedOccasion
      });
      
      showToast('Product added to cart successfully!', 'success');
      setQuantity(1);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter(item => item !== id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsInWishlist(false);
      showToast('Removed from wishlist', 'success');
    } else {
      wishlist.push(id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
      showToast('Added to wishlist', 'success');
    }
  };

  const handleSubmitReview = async (formData) => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      if (editingReview) {
        await productService.updateReview(id, editingReview._id, formData);
        setEditingReview(null);
        showToast('Review updated successfully!', 'success');
      } else {
        await productService.addReview(id, formData);
        showToast('Review submitted successfully!', 'success');
      }
      
      setShowReviewForm(false);
      fetchProductDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    showModal(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      'warning',
      async () => {
        try {
          await productService.deleteReview(id, reviewId);
          fetchProductDetails();
          showToast('Review deleted successfully', 'success');
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to delete review', 'error');
        }
      },
      'Delete'
    );
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      await productService.markReviewHelpful(id, reviewId);
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review._id === reviewId) {
            return {
              ...review,
              helpfulCount: (review.helpfulCount || 0) + 1
            };
          }
          return review;
        })
      );
      showToast('Marked as helpful', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to mark review as helpful', 'error');
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    showModal(
      'Report Review',
      'Please select a reason for reporting this review:',
      'report',
      async (reason) => {
        if (reason && ['inappropriate', 'spam', 'offensive', 'misleading', 'other'].includes(reason.toLowerCase())) {
          try {
            await productService.reportReview(id, reviewId, { reason: reason.toLowerCase() });
            showToast('Review reported successfully. Our team will review it shortly.', 'success');
          } catch (err) {
            showToast(err.response?.data?.message || 'Failed to report review', 'error');
          }
        } else if (reason) {
          showToast('Please select a valid reason', 'error');
        }
      },
      'Report'
    );
  };

  const handleShareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on BloomBox!`,
          url: window.location.href,
        });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          await handleCopyLink();
        }
      }
    } else {
      await handleCopyLink();
    }
    setShowShareModal(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleOccasionSelect = (occasion) => {
    setSelectedOccasion(occasion);
    showToast(`Selected for: ${occasion}`, 'info');
  };

  const calculateDiscountPercentage = () => {
    if (!product?.discountPrice) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating?.toFixed(1) || '0.0'}</span>
      </div>
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for might have been removed or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 font-semibold transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn ${toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl animate-fadeIn">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{modal.title}</h3>
              <p className="text-gray-600 mb-6">{modal.message}</p>
              
              {modal.type === 'report' && (
                <div className="space-y-2 mb-6">
                  {['Inappropriate', 'Spam', 'Offensive', 'Misleading', 'Other'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        const reasonValue = reason.toLowerCase();
                        modal.onConfirm && modal.onConfirm(reasonValue);
                        closeModal();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
              
              {modal.type !== 'report' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      modal.onConfirm && modal.onConfirm();
                      closeModal();
                    }}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      modal.type === 'warning' 
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-md' 
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-md'
                    }`}
                  >
                    {modal.confirmText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <nav className="flex items-center text-sm text-gray-600 flex-wrap gap-1 sm:gap-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center hover:text-pink-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <span className="mx-1 sm:mx-2">/</span>
            <button
              onClick={() => navigate('/products')}
              className="hover:text-pink-600 transition-colors"
            >
              Products
            </button>
            <span className="mx-1 sm:mx-2">/</span>
            <button
              onClick={() => navigate(`/products?category=${product.category}`)}
              className="hover:text-pink-600 transition-colors truncate max-w-[100px] sm:max-w-none"
            >
              {product.category}
            </button>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center overflow-hidden mb-3 sm:mb-4 relative">
                {product.images?.[selectedImage]?.url ? (
                  <img
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-6xl sm:text-8xl">💐</div>
                )}
                
                {product.discountPrice && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg">
                    {calculateDiscountPercentage()}% OFF
                  </div>
                )}
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white shadow-lg"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
              </div>
              
              {product.images?.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index ? 'border-pink-500 shadow-md scale-105' : 'border-gray-200 hover:border-pink-300'}`}
                    >
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xl sm:text-2xl">
                          🌸
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">Order over $50</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Fresh Guarantee</p>
                <p className="text-xs text-gray-500">7-day freshness</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Gift Ready</p>
                <p className="text-xs text-gray-500">Free gift wrap</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Same Day</p>
                <p className="text-xs text-gray-500">Delivery available</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm mb-4 sm:mb-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                    {product.isFeatured && (
                      <span className="px-2 sm:px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {product.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center">
                      {renderRatingStars(product.ratings || 0)}
                      <span className="ml-1 text-gray-500 text-sm">
                        ({product.numOfReviews || 0} reviews)
                      </span>
                    </div>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className={`font-medium text-sm sm:text-base ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAddToWishlist}
                  className={`p-2 sm:p-3 rounded-full transition-all ${isInWishlist ? 'bg-pink-100 text-pink-600 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'}`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-lg sm:text-xl text-gray-500 line-through">
                        ${product.price}
                      </span>
                      <span className="bg-red-100 text-red-600 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-semibold">
                        Save ${(product.price - product.discountPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {product.discountPrice && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {calculateDiscountPercentage()}% discount applied
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Occasions */}
              {product.occasion && product.occasion.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Perfect For:</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {product.occasion.map((occasion) => (
                      <button
                        key={occasion}
                        onClick={() => handleOccasionSelect(occasion)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-sm ${selectedOccasion === occasion ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {occasion}
                      </button>
                    ))}
                  </div>
                  {selectedOccasion && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      Selected for: <span className="font-medium">{selectedOccasion}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Care Instructions */}
              {product.careInstructions && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    Care Instructions
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
                    {product.careInstructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-full p-0.5">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className="p-2 sm:p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="w-12 sm:w-16 text-center font-bold text-base sm:text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className="p-2 sm:p-3 text-gray-600 hover:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addingToCart || !user}
                      className={`w-full py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center transition-all ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl'}`}
                    >
                      {addingToCart ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3" />
                          Adding...
                        </>
                      ) : !user ? (
                        'Login to Purchase'
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded-lg">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    Only {product.stock} item{product.stock > 1 ? 's' : ''} left in stock!
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Category:</span>
                      <span className="font-medium text-sm sm:text-base">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">SKU:</span>
                      <span className="font-medium text-sm sm:text-base">{product.sku || 'BB-' + product._id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Freshness:</span>
                      <span className="font-medium text-sm sm:text-base">7-Day Guarantee</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Delivery:</span>
                      <span className="font-medium text-sm sm:text-base">1-2 Business Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Best Seller:</span>
                      <span className="font-medium text-sm sm:text-base">{product.isBestSeller ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Return Policy:</span>
                      <span className="font-medium text-sm sm:text-base">30-Day Return</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Customer Reviews ({product.numOfReviews || 0})
                </h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-base sm:text-lg font-bold">{product.ratings?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-gray-500 text-sm sm:text-base">out of 5</span>
                </div>
              </div>
              
              {user ? (
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setShowReviewForm(!showReviewForm);
                  }}
                  className="bg-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-pink-600 font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login', { state: { from: `/product/${id}` } })}
                  className="bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-900 font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  Login to Review
                </button>
              )}
            </div>

            {/* Review Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
              >
                <option value="createdAt">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="helpfulCount">Most Helpful</option>
              </select>
              
              <select 
                value={filter}
                onChange={handleFilterChange}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
              >
                <option value="">All Reviews</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
                <option value="verified">Verified Purchases</option>
              </select>
            </div>

            {showReviewForm && (
              <div className="mb-6 sm:mb-8">
                <ReviewForm
                  onSubmit={handleSubmitReview}
                  onCancel={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                  }}
                  productName={product.name}
                  initialData={editingReview}
                  isEditMode={!!editingReview}
                />
              </div>
            )}

            {reviewsLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading reviews...</p>
              </div>
            ) : (
              <ReviewList
                reviews={filteredReviews}
                onHelpfulClick={handleMarkHelpful}
                onReportClick={handleReportReview}
                onEditClick={handleEditReview}
                onDeleteClick={handleDeleteReview}
                currentUserId={user?._id}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-3 sm:p-4">
                      {relatedProduct.images?.[0]?.url ? (
                        <img
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-4xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
                          🌸
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        View Details
                      </div>
                    </div>
                    
                    {relatedProduct.discountPrice && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors text-sm sm:text-base">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ${relatedProduct.discountPrice || relatedProduct.price}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                            ${relatedProduct.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs sm:text-sm font-medium">
                          {relatedProduct.ratings?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => navigate(`/products?category=${product.category}`)}
                className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-200 font-semibold transition-colors text-sm sm:text-base"
              >
                View All in {product.category}
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="border-b pb-3 sm:pb-4">
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">How fresh are the flowers?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">All our flowers are sourced daily from local growers and delivered within 24-48 hours of cutting. We guarantee freshness for 7 days.</p>
              </div>
              <div className="border-b pb-3 sm:pb-4">
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Can I schedule delivery?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Yes! During checkout, you can select your preferred delivery date up to 30 days in advance.</p>
              </div>
              <div className="border-b pb-3 sm:pb-4">
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">What's your return policy?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, we'll replace it or provide a full refund.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Do you deliver to my area?</h3>
                <p className="text-gray-600 text-xs sm:text-sm">We deliver to all major cities within the continental US. Enter your ZIP code during checkout to check availability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Share this product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleShareProduct}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Share via...
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        @media (max-width: 640px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;