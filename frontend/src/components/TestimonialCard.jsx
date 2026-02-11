// // components/TestimonialCard.jsx
// import React from 'react';
// import { Star } from 'lucide-react';

// const TestimonialCard = ({ testimonial }) => {
//   return (
//     <div className="bg-white rounded-2xl p-8 shadow-lg">
//       <div className="flex items-center mb-6">
//         <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center text-2xl mr-4">
//           {testimonial.image}
//         </div>
//         <div>
//           <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
//           <div className="flex mt-1">
//             {[...Array(5)].map((_, i) => (
//               <Star 
//                 key={i}
//                 className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <p className="text-gray-600 italic">"{testimonial.comment}"</p>
      
//       <div className="mt-6 pt-6 border-t border-gray-100">
//         <div className="text-4xl text-pink-200 opacity-50">"</div>
//       </div>
//     </div>
//   );
// };

// export default TestimonialCard;

import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  // Add default values to prevent errors
  if (!testimonial) return null;
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img 
            src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name || 'User')}&background=random`}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{testimonial.name || 'Anonymous'}</h4>
          <p className="text-sm text-gray-500 mt-1">{testimonial.role || 'Happy Customer'}</p>
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 italic">"{testimonial.content || testimonial.comment || 'Excellent service and beautiful flowers!'}"</p>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-4xl text-pink-200 opacity-50 text-right">"</div>
      </div>
    </div>
  );
};

export default TestimonialCard;