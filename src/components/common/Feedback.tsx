import React from 'react';
import { Radar, AlertTriangle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Detections Found',
  description = 'Upload a side-scan sonar image and run an analysis to view potential underwater target candidates.',
  action,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-sand-200 rounded-xl my-4 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-sand-900 mb-1">{title}</h3>
      <p className="text-sm text-sand-600 max-w-md mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing sonar imagery...',
  subtext = 'Processing acoustic reflections and calculating candidate anomaly coordinates',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-sand-200 rounded-xl my-4 min-h-[240px] shadow-xs">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin" />
        <Radar className="w-6 h-6 text-sky-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <h4 className="text-base font-medium text-sand-900 mb-1">{message}</h4>
      <p className="text-xs text-sand-600 max-w-sm">{subtext}</p>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Process Survey',
  message = 'An unexpected error occurred while communicating with the sonar processing service.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-200 rounded-xl my-4">
      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-base font-semibold text-red-900 mb-1">{title}</h4>
      <p className="text-sm text-red-700 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-xs"
        >
          Retry Operation
        </button>
      )}
    </div>
  );
};
