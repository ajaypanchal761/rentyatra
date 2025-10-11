import { useState } from 'react';

function CategoryChart() {
  const [view, setView] = useState('products'); // 'products' or 'revenue'

  // Mock category data
  const categoryData = [
    { name: 'Electronics', products: 1245, revenue: 125400, color: 'from-blue-500 to-indigo-500', gradient: ['#3B82F6', '#6366F1'], bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { name: 'Real Estate', products: 890, revenue: 245600, color: 'from-green-500 to-emerald-500', gradient: ['#10B981', '#059669'], bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { name: 'Vehicles', products: 756, revenue: 189300, color: 'from-orange-500 to-red-500', gradient: ['#F97316', '#EF4444'], bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
    { name: 'Fashion', products: 654, revenue: 78900, color: 'from-pink-500 to-rose-500', gradient: ['#EC4899', '#F43F5E'], bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
    { name: 'Sports', products: 543, revenue: 56700, color: 'from-purple-500 to-violet-500', gradient: ['#A855F7', '#8B5CF6'], bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    { name: 'Furniture', products: 432, revenue: 92400, color: 'from-yellow-500 to-amber-500', gradient: ['#EAB308', '#F59E0B'], bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { name: 'Others', products: 370, revenue: 34200, color: 'from-slate-500 to-gray-500', gradient: ['#64748B', '#6B7280'], bgColor: 'bg-slate-100', textColor: 'text-slate-700' }
  ];

  const totalProducts = categoryData.reduce((sum, cat) => sum + cat.products, 0);
  const totalRevenue = categoryData.reduce((sum, cat) => sum + cat.revenue, 0);

  const getPercentage = (value, total) => ((value / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Category Distribution</h3>
          <p className="text-sm text-slate-500 mt-1">Breakdown by category</p>
        </div>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="products">By Products</option>
          <option value="revenue">By Revenue</option>
        </select>
      </div>

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* SVG Donut Chart */}
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="20"
            />
            {categoryData.map((category, index) => {
              const total = view === 'products' ? totalProducts : totalRevenue;
              const value = view === 'products' ? category.products : category.revenue;
              const percentage = (value / total) * 100;
              const circumference = 2 * Math.PI * 40;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              
              // Calculate offset based on previous segments
              const prevPercentages = categoryData.slice(0, index).reduce((sum, cat) => {
                const v = view === 'products' ? cat.products : cat.revenue;
                return sum + (v / total) * 100;
              }, 0);
              const strokeDashoffset = -(prevPercentages / 100) * circumference;

              return (
                <circle
                  key={category.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
            
            {/* Gradients */}
            <defs>
              {categoryData.map((category, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={category.gradient[0]} />
                  <stop offset="100%" stopColor={category.gradient[1]} />
                </linearGradient>
              ))}
            </defs>
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-900">{categoryData.length}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categoryData.map((category, index) => {
          const value = view === 'products' ? category.products : category.revenue;
          const total = view === 'products' ? totalProducts : totalRevenue;
          const percentage = getPercentage(value, total);
          
          return (
            <div key={category.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${category.color}`}></div>
                  <span className="text-sm font-medium text-slate-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">
                    {view === 'products' ? value.toLocaleString() : `$${value.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">({percentage}%)</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500 group-hover:opacity-80`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Total</span>
          <span className="text-lg font-bold text-indigo-600">
            {view === 'products' 
              ? `${totalProducts.toLocaleString()} Products` 
              : `$${totalRevenue.toLocaleString()}`
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;

