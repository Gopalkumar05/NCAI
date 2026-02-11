import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const EmptyState = ({ 
  icon = "📦", 
  title = "Nothing Here", 
  description = "There's nothing to display at the moment.", 
  actionText = "Get Started",
  onAction,
  actionLink
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 flex items-center gap-2 mx-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            {actionText}
          </button>
        )}
        {actionLink && (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600"
          >
            <ShoppingBag className="w-5 h-5" />
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;