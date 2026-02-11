// // components/CategoryCard.jsx
// import React from 'react';
// import { ChevronRight } from 'lucide-react';

// const CategoryCard = ({ category }) => {
//   return (
//     <div className={`${category.color} rounded-2xl p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer group`}>
//       <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
//         {category.icon}
//       </div>
//       <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
//       <div className="flex items-center justify-center text-gray-600 text-sm">
//         <span>{category.count} items</span>
//         <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>
//     </div>
//   );
// };

// export default CategoryCard;

import React from 'react';

const CategoryCard = ({ category }) => {
  const { name, count, icon, color } = category;

  return (
    <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className={`${color || 'bg-pink-100'} w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon || '🌸'}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600">{count || 0} items</p>
    </div>
  );
};

export default CategoryCard;