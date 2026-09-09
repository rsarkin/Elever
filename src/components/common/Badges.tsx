import React from 'react';
import { PriorityLevel, VerificationStatus } from '../../types';
import { CheckCircle2, XCircle, Bot, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const configs = {
    high: {
      label: 'HIGH PRIORITY',
      bg: 'bg-red-50 border-red-200 text-red-700',
      icon: AlertTriangle,
    },
    medium: {
      label: 'MEDIUM PRIORITY',
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertCircle,
    },
    low: {
      label: 'LOW PRIORITY',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', // Pastel green
      icon: Info,
    },
  };

  const config = configs[priority] || configs.low;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${config.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const configs = {
    ai_detected: {
      label: 'AI Detected',
      bg: 'bg-sky-50 border-sky-200 text-sky-700 font-medium', // Suitable marine blue
      icon: Bot,
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold', // Soft Pastel Green
      icon: CheckCircle2,
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 border-rose-200 text-rose-700 font-medium',
      icon: XCircle,
    },
  };

  const config = configs[status] || configs.ai_detected;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${config.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

interface ConfidenceBadgeProps {
  confidence: number; // 0.0 - 1.0
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence, className = '' }) => {
  const percentage = Math.round(confidence * 100);

  let textColor = 'text-sky-700';
  if (percentage >= 80) textColor = 'text-emerald-700 font-bold'; // Soft pastel green for high confidence
  else if (percentage >= 60) textColor = 'text-amber-800 font-semibold';
  else textColor = 'text-sand-600';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-mono font-medium ${textColor} ${className}`}>
      <span>{percentage}%</span>
      <span className="text-[10px] text-sand-500 font-sans">confidence</span>
    </span>
  );
};
