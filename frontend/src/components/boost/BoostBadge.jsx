import { Zap } from 'lucide-react';

const BoostBadge = ({ className = '', size = 'default', showPulse = true }) => {
  const sizes = {
    sm: {
      badge: 'px-2 py-1 text-[10px]',
      icon: 12
    },
    default: {
      badge: 'px-3 py-1.5 text-xs',
      icon: 14
    },
    lg: {
      badge: 'px-4 py-2 text-sm',
      icon: 16
    }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-black uppercase tracking-wide rounded-full shadow-lg ${currentSize.badge} ${className} ${showPulse ? 'animate-pulse' : ''}`}>
      <Zap size={currentSize.icon} fill="currentColor" strokeWidth={0} />
      <span>Boosted</span>
    </div>
  );
};

export default BoostBadge;

