import { useState } from 'react';
import * as Icons from '../icons/AdminIcons';
import { MOCK_REFERRALS } from '../../../utils/adminMockData';

function ReferralManagementView() {
  const [referrals, setReferrals] = useState(MOCK_REFERRALS);

  const completedReferrals = referrals.filter(r => r.status === 'Completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'Pending').length;
  const totalRewards = referrals
    .filter(r => r.status === 'Completed')
    .reduce((sum, r) => sum + parseFloat(r.reward.replace('$', '')), 0);

  // Top referrers
  const referrerCounts = {};
  referrals.forEach(ref => {
    if (!referrerCounts[ref.referrerId]) {
      referrerCounts[ref.referrerId] = {
        id: ref.referrerId,
        name: ref.referrerName,
        count: 0,
        rewards: 0
      };
    }
    referrerCounts[ref.referrerId].count++;
    if (ref.status === 'Completed') {
      referrerCounts[ref.referrerId].rewards += parseFloat(ref.reward.replace('$', ''));
    }
  });

  const topReferrers = Object.values(referrerCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Referrals</p>
              <p className="text-2xl font-bold text-slate-800">{referrals.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icons.ReferralIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-slate-800">{completedReferrals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icons.CheckIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{pendingReferrals}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icons.ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Rewards</p>
              <p className="text-2xl font-bold text-slate-800">${totalRewards.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icons.RevenueIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Referrers Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Icons.TrendIcon className="h-5 w-5 text-indigo-600" />
            Top Referrers Leaderboard
          </h3>
          <div className="space-y-3">
            {topReferrers.map((referrer, index) => (
              <div key={referrer.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-slate-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-indigo-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{referrer.name}</p>
                  <p className="text-xs text-slate-500">{referrer.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">{referrer.count}</p>
                  <p className="text-xs text-slate-500">referrals</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">${referrer.rewards}</p>
                  <p className="text-xs text-slate-500">earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Referral Program Settings</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-green-900">Referrer Reward</span>
                <span className="text-2xl font-bold text-green-600">$10</span>
              </div>
              <p className="text-sm text-green-700">Per successful referral</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-900">Referee Reward</span>
                <span className="text-2xl font-bold text-blue-600">$5</span>
              </div>
              <p className="text-sm text-blue-700">Welcome bonus for new users</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-900">Minimum Payout</span>
                <span className="text-2xl font-bold text-purple-600">$20</span>
              </div>
              <p className="text-sm text-purple-700">Threshold for withdrawal</p>
            </div>

            <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Update Settings
            </button>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">All Referrals</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Referral ID</th>
                <th scope="col" className="px-6 py-3">Referrer</th>
                <th scope="col" className="px-6 py-3">Referred User</th>
                <th scope="col" className="px-6 py-3">Reward</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-slate-600">{referral.id}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{referral.referrerName}</p>
                      <p className="text-xs text-slate-500">{referral.referrerId}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{referral.referredName}</p>
                      <p className="text-xs text-slate-500">{referral.referredId}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-green-600">{referral.reward}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{referral.date}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      referral.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReferralManagementView;

