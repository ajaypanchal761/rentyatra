function PlaceholderView({ title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-500 mb-6">
        {description || `This is the ${title} page. Build out your component here!`}
      </p>
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
        <div className="text-slate-400 text-6xl mb-4">📊</div>
        <p className="text-slate-600 font-medium">Content coming soon...</p>
        <p className="text-sm text-slate-500 mt-2">This section is under development</p>
      </div>
    </div>
  );
}

export default PlaceholderView;




