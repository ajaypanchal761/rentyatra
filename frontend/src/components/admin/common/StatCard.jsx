import * as Icons from '../icons/AdminIcons';

function StatCard({ item }) {
  // Map icon name to actual icon component
  const Icon = Icons[item.icon];
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-slate-100 ${item.color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{item.title}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-slate-800">{item.value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;




