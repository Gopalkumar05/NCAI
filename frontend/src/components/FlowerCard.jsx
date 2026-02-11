// // components/FlowerCard.jsx
// import React from 'react';
// import { Heart, Star } from 'lucide-react';

// const FlowerCard = ({ flower }) => {
//   const [isLiked, setIsLiked] = React.useState(false);

//   return (
//     <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200">
//       <div className="relative">
//         <div className="h-64 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-8">
//           <div className="text-7xl transform group-hover:scale-110 transition-transform duration-500">
//             {flower.image}
//           </div>
//         </div>
        
//         <button
//           onClick={() => setIsLiked(!isLiked)}
//           className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
//         >
//           <Heart 
//             className={`w-5 h-5 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} 
//           />
//         </button>
        
//         {flower.originalPrice && (
//           <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//             Save ${(flower.originalPrice - flower.price).toFixed(2)}
//           </div>
//         )}
//       </div>
      
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-bold text-lg text-gray-900">{flower.name}</h3>
//           <div className="flex items-center space-x-1">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//             <span className="font-semibold">{flower.rating}</span>
//             <span className="text-gray-400 text-sm">({flower.reviews})</span>
//           </div>
//         </div>
        
//         <p className="text-gray-600 text-sm mb-4">Perfect for {flower.occasion}</p>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-baseline space-x-2">
//             <span className="text-2xl font-bold text-gray-900">${flower.price.toFixed(2)}</span>
//             {flower.originalPrice && (
//               <span className="text-gray-400 line-through">${flower.originalPrice.toFixed(2)}</span>
//             )}
//           </div>
          
//           <div className="flex space-x-1">
//             {flower.colors.map((color, index) => (
//               <div key={index} className={`w-4 h-4 rounded-full ${color} border border-gray-200`}></div>
//             ))}
//           </div>
//         </div>
        
//         <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FlowerCard;
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlowerCard = ({ flower, onAddToCart }) => {
  const {
    _id,
    name,
    price,
    discountPrice,
    ratings,
    numOfReviews,
    images,
    occasion = [],
    isAvailable,
    stock
  } = flower;

  const discount = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && isAvailable) {
      onAddToCart(_id);
    }
  };

  return (
    <Link 
      to={`/product/${_id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-6xl">
          {images?.[0]?.url ? (
            <img
              src={images[0].url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            '💐'
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {!isAvailable && (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </span>
          )}
          {stock <= 5 && stock > 0 && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Only {stock} left
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isAvailable 
              ? 'bg-pink-500 hover:bg-pink-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } p-3 rounded-full shadow-lg`}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold">{ratings || 0}</span>
            <span className="ml-1 text-sm text-gray-500">({numOfReviews || 0})</span>
          </div>
        </div>

        {/* Occasion Tags */}
        {occasion.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {occasion.slice(0, 2).map((occ, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs"
              >
                {occ}
              </span>
            ))}
            {occasion.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{occasion.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${discountPrice || price}
            </span>
            {discountPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FlowerCard;