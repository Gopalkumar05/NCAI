import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Prepare data for chart
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: months.map((_, index) => {
          const monthData = data.find(item => item._id === index + 1);
          return monthData ? monthData.revenue : 0;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Orders',
        data: months.map((_, index) => {
          const monthData = data.find(item => item._id === index + 1);
          return monthData ? monthData.orders : 0;
        }),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Revenue') {
              return `Revenue: ${formatCurrency(context.raw)}`;
            }
            return `Orders: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <div className="flex space-x-4">
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;