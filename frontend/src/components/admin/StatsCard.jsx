// const StatsCard = ({ title, value, icon: Icon, change, color = 'primary' }) => {
//   const colors = {
//     primary: 'bg-primary-50 text-primary-600',
//     green: 'bg-green-50 text-green-600',
//     blue: 'bg-blue-50 text-blue-600',
//     purple: 'bg-purple-50 text-purple-600',
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
//           {change && (
//             <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {change > 0 ? '+' : ''}{change}% from last month
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-full ${colors[color]}`}>
//           <Icon className="w-6 h-6" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;

// components/admin/StatsCard.jsx
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color, 
  trend = 'up', 
  subtitle,
  size = 'medium'
}) => {
  const colorConfig = {
    primary: {
      bg: 'bg-primary-50',
      iconBg: 'bg-primary-100',
      text: 'text-primary-700',
      border: 'border-primary-200'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200'
    }
  };

  const sizeConfig = {
    small: {
      padding: 'p-3',
      iconSize: 'h-4 w-4',
      iconPadding: 'p-2',
      valueSize: 'text-lg',
      titleSize: 'text-xs'
    },
    medium: {
      padding: 'p-4 md:p-6',
      iconSize: 'h-5 w-5 md:h-6 md:w-6',
      iconPadding: 'p-2 md:p-3',
      valueSize: 'text-xl md:text-2xl',
      titleSize: 'text-sm'
    },
    large: {
      padding: 'p-6 md:p-8',
      iconSize: 'h-6 w-6 md:h-8 md:w-8',
      iconPadding: 'p-3 md:p-4',
      valueSize: 'text-2xl md:text-3xl',
      titleSize: 'text-base'
    }
  };

  const config = colorConfig[color] || colorConfig.primary;
  const sizeStyle = sizeConfig[size];

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border ${config.border} 
      ${sizeStyle.padding} transition-all duration-200 
      hover:shadow-md hover:border-gray-300
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={`${sizeStyle.titleSize} font-medium text-gray-600 truncate`}>
            {title}
          </p>
          <p className={`${sizeStyle.valueSize} font-bold text-gray-900 mt-1 truncate`}>
            {value}
          </p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className={`h-3 w-3 md:h-4 md:w-4 ${config.text} mr-1 flex-shrink-0`} />
              ) : (
                <ArrowTrendingDownIcon className={`h-3 w-3 md:h-4 md:w-4 text-red-600 mr-1 flex-shrink-0`} />
              )}
              <span className={`text-xs md:text-sm font-medium ${trend === 'up' ? config.text : 'text-red-600'}`}>
                {trend === 'up' ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-2 hidden xs:inline">
                from last period
              </span>
            </div>
          )}
        </div>
        <div className={`${sizeStyle.iconPadding} rounded-lg ${config.iconBg} ${config.text} ml-3 flex-shrink-0`}>
          <Icon className={sizeStyle.iconSize} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;