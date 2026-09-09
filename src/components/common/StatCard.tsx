import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      border: 'border-sand-200',
      iconBg: 'bg-sand-100 text-sand-700 border border-sand-200',
    },
    accent: {
      border: 'border-sky-200',
      iconBg: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    warning: {
      border: 'border-amber-200',
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    success: {
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', // Soft Pastel Green
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`p-5 rounded-xl bg-white border ${currentStyle.border} shadow-xs flex items-start justify-between relative overflow-hidden group hover:shadow-md hover:border-sand-300 transition-all`}>
      <div>
        <span className="text-xs font-mono tracking-wider uppercase text-sand-500 font-semibold block mb-1">
          {title}
        </span>
        <div className="text-2xl font-bold font-mono text-sand-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-sand-600 mt-1 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`p-2.5 rounded-lg ${currentStyle.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
