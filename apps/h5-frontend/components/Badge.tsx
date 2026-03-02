
import React from 'react';

interface BadgeProps {
  status: 'completed' | 'pending' | 'cancelled';
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-slate-100 text-slate-500',
  };

  const labels = {
    completed: '已完成',
    pending: '进行中',
    cancelled: '已取消',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default Badge;
