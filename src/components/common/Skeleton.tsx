import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      style={style}
      className={`bg-sand-200/70 animate-pulse rounded-xl ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-2 border-b border-sand-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* 3 Centered Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 bg-red-200/50" />
              <Skeleton className="h-5 w-24 rounded-full bg-red-200/50" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SurveyListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-full max-w-md rounded-xl" />

      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex flex-col lg:flex-row justify-between gap-5">
            <div className="flex items-start gap-4 lg:w-1/3">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-full rounded-full" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-3">
              <Skeleton className="h-5 w-28 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LocationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-2xl border border-sand-200 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-48 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
        <div className="flex justify-center pt-2">
          <Skeleton className="h-10 w-96 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 h-[640px] bg-sand-900 rounded-2xl border border-sand-700 p-4 flex flex-col justify-between">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-64 bg-sand-800" />
            <Skeleton className="h-9 w-32 bg-sand-800" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-48 bg-sand-800 rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-2xl border border-sand-200 p-5 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ReportsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-sand-200 flex justify-between items-center">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-10 w-64 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 p-5 space-y-4">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
};
