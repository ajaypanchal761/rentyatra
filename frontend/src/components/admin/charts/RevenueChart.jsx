import { useState } from 'react';

function RevenueChart() {
  const [period, setPeriod] = useState('30days');

  // Mock revenue data
  const revenueData = {
    '7days': [
      { day: 'Mon', revenue: 1250 },
      { day: 'Tue', revenue: 1890 },
      { day: 'Wed', revenue: 2340 },
      { day: 'Thu', revenue: 1680 },
      { day: 'Fri', revenue: 2890 },
      { day: 'Sat', revenue: 3450 },
      { day: 'Sun', revenue: 2980 }
    ],
    '30days': [
      { day: 'Week 1', revenue: 8450 },
      { day: 'Week 2', revenue: 12340 },
      { day: 'Week 3', revenue: 10890 },
      { day: 'Week 4', revenue: 14231 }
    ],
    '90days': [
      { day: 'Month 1', revenue: 35450 },
      { day: 'Month 2', revenue: 42890 },
      { day: 'Month 3', revenue: 45231 }
    ]
  };

  const data = revenueData[period];
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / data.length);

  // Calculate percentage change
  const previousTotal = data.length > 1 ? data[data.length - 2].revenue : data[0].revenue;
  const currentTotal = data[data.length - 1].revenue;
  const percentageChange = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
          <p className="text-sm text-slate-500 mt-1">Track your earnings over time</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-green-600 mb-1">Average</p>
          <p className="text-2xl font-bold text-green-900">${avgRevenue.toLocaleString()}</p>
        </div>
        <div className={`bg-gradient-to-br ${
          percentageChange >= 0 ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-red-50 to-pink-50 border-red-100'
        } p-4 rounded-lg border`}>
          <p className={`text-xs font-medium ${percentageChange >= 0 ? 'text-emerald-600' : 'text-red-600'} mb-1`}>
            Change
          </p>
          <p className={`text-2xl font-bold ${percentageChange >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-around gap-2 px-2">
          {data.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100;
            const isHighest = item.revenue === maxRevenue;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                {/* Bar */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-10">
                    ${item.revenue.toLocaleString()}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                  </div>
                  
                  {/* Bar Column */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90 ${
                      isHighest
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                        : 'bg-gradient-to-t from-blue-500 to-blue-300'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Shine effect */}
                    <div className="w-full h-full rounded-t-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                  </div>
                </div>
                
                {/* Label */}
                <p className="text-xs font-medium text-slate-600 mt-2">{item.day}</p>
              </div>
            );
          })}
        </div>

        {/* Y-axis reference lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div key={percent} className="relative">
              <div className="absolute left-0 right-0 border-t border-slate-200 border-dashed"></div>
              <span className="absolute -left-12 -top-2 text-xs text-slate-400 font-medium">
                ${Math.round((maxRevenue * percent) / 100).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-blue-500 to-blue-300"></div>
          <span className="text-xs text-slate-600">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-indigo-600 to-indigo-400"></div>
          <span className="text-xs text-slate-600">Highest</span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;


