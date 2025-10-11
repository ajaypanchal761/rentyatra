import { useState } from 'react';

function UserGrowthChart() {
  const [period, setPeriod] = useState('6months');

  // Mock user growth data
  const growthData = {
    '3months': [
      { month: 'Jan', newUsers: 450, totalUsers: 8450 },
      { month: 'Feb', newUsers: 680, totalUsers: 9130 },
      { month: 'Mar', newUsers: 890, totalUsers: 10020 }
    ],
    '6months': [
      { month: 'Oct', newUsers: 320, totalUsers: 6890 },
      { month: 'Nov', newUsers: 410, totalUsers: 7300 },
      { month: 'Dec', newUsers: 540, totalUsers: 7840 },
      { month: 'Jan', newUsers: 450, totalUsers: 8290 },
      { month: 'Feb', newUsers: 680, totalUsers: 8970 },
      { month: 'Mar', newUsers: 890, totalUsers: 9860 }
    ],
    '12months': [
      { month: 'Apr', newUsers: 180, totalUsers: 4200 },
      { month: 'May', newUsers: 220, totalUsers: 4420 },
      { month: 'Jun', newUsers: 290, totalUsers: 4710 },
      { month: 'Jul', newUsers: 310, totalUsers: 5020 },
      { month: 'Aug', newUsers: 350, totalUsers: 5370 },
      { month: 'Sep', newUsers: 380, totalUsers: 5750 },
      { month: 'Oct', newUsers: 420, totalUsers: 6170 },
      { month: 'Nov', newUsers: 510, totalUsers: 6680 },
      { month: 'Dec', newUsers: 640, totalUsers: 7320 },
      { month: 'Jan', newUsers: 750, totalUsers: 8070 },
      { month: 'Feb', newUsers: 840, totalUsers: 8910 },
      { month: 'Mar', newUsers: 920, totalUsers: 9830 }
    ]
  };

  const data = growthData[period];
  const maxUsers = Math.max(...data.map(d => d.totalUsers));
  const maxNewUsers = Math.max(...data.map(d => d.newUsers));
  const currentUsers = data[data.length - 1].totalUsers;
  const previousUsers = data[data.length - 2]?.totalUsers || data[0].totalUsers;
  const growthRate = (((currentUsers - previousUsers) / previousUsers) * 100).toFixed(1);
  const totalNewUsers = data.reduce((sum, d) => sum + d.newUsers, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">User Growth</h3>
          <p className="text-sm text-slate-500 mt-1">Total and new user trends</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="12months">Last 12 Months</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-xs font-medium text-indigo-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-indigo-900">{currentUsers.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-green-600 mb-1">New Users</p>
          <p className="text-2xl font-bold text-green-900">{totalNewUsers.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <p className="text-xs font-medium text-purple-600 mb-1">Growth Rate</p>
          <p className="text-2xl font-bold text-purple-900">+{growthRate}%</p>
        </div>
      </div>

      {/* Dual Axis Chart */}
      <div className="relative h-64">
        {/* Chart Container */}
        <div className="absolute inset-0 flex items-end justify-around gap-1 px-2">
          {data.map((item, index) => {
            const totalHeight = (item.totalUsers / maxUsers) * 100;
            const newHeight = (item.newUsers / maxNewUsers) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                {/* New Users Bar (Overlaid) */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Tooltip for New Users */}
                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-10">
                    <div>New: {item.newUsers.toLocaleString()}</div>
                    <div>Total: {item.totalUsers.toLocaleString()}</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                  </div>
                  
                  {/* Stacked Bars */}
                  <div className="relative w-full flex items-end justify-center gap-0.5">
                    {/* Total Users Line (Area) */}
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500/30 to-blue-400/30 rounded-t-lg transition-all duration-300 border-t-2 border-indigo-500"
                      style={{ height: `${totalHeight}%` }}
                    ></div>
                    
                    {/* New Users Bar (Solid) */}
                    <div
                      className="absolute bottom-0 w-1/2 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                      style={{ height: `${newHeight * 0.8}%` }}
                    >
                      <div className="w-full h-full rounded-t-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <p className="text-xs font-medium text-slate-600 mt-2">{item.month}</p>
              </div>
            );
          })}
        </div>

        {/* Y-axis reference lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div key={percent} className="relative">
              <div className="absolute left-0 right-0 border-t border-slate-200 border-dashed"></div>
              <span className="absolute -left-14 -top-2 text-xs text-slate-400 font-medium">
                {Math.round((maxUsers * percent) / 100).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-indigo-500/30 to-blue-400/30 border-t-2 border-indigo-500"></div>
          <span className="text-xs text-slate-600">Total Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-green-600 to-green-400"></div>
          <span className="text-xs text-slate-600">New Users</span>
        </div>
      </div>

      {/* Growth Indicators */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Avg New Users/Month</p>
          <p className="text-lg font-bold text-slate-900">
            {Math.round(totalNewUsers / data.length).toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Peak Month</p>
          <p className="text-lg font-bold text-slate-900">
            {data.reduce((max, d) => d.newUsers > max.newUsers ? d : max, data[0]).month}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserGrowthChart;


