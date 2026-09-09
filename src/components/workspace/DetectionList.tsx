import React, { useState } from 'react';
import { Detection } from '../../types';
import { PriorityBadge, StatusBadge, ConfidenceBadge } from '../common/Badges';
import { Search, ShieldAlert } from 'lucide-react';

interface DetectionListProps {
  detections: Detection[];
  selectedDetectionId: string | null;
  onSelectDetection: (id: string) => void;
}

export const DetectionList: React.FC<DetectionListProps> = ({
  detections,
  selectedDetectionId,
  onSelectDetection,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDetections = detections.filter(d => {
    if (priorityFilter !== 'all' && d.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchClass = d.class_name.toLowerCase().includes(q);
      const matchNotes = d.notes?.toLowerCase().includes(q) || false;
      if (!matchClass && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border border-sand-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header & Filter Controls */}
      <div className="p-3.5 border-b border-sand-200 bg-sand-50/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-sand-900 font-mono tracking-tight">
              Detections ({filteredDetections.length})
            </h3>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-sand-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search anomaly class..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-sand-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-sand-900 focus:outline-none focus:border-sky-500 font-sans shadow-xs"
          />
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
          <button
            onClick={() => { setPriorityFilter('all'); setStatusFilter('all'); }}
            className={`px-2 py-0.5 rounded border whitespace-nowrap ${
              priorityFilter === 'all' && statusFilter === 'all'
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold'
                : 'bg-white border-sand-200 text-sand-600 hover:text-sand-900'
            }`}
          >
            All ({detections.length})
          </button>

          <button
            onClick={() => setPriorityFilter('high')}
            className={`px-2 py-0.5 rounded border whitespace-nowrap ${
              priorityFilter === 'high'
                ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                : 'bg-white border-sand-200 text-sand-600 hover:text-sand-900'
            }`}
          >
            High Priority
          </button>

          <button
            onClick={() => setStatusFilter('ai_detected')}
            className={`px-2 py-0.5 rounded border whitespace-nowrap ${
              statusFilter === 'ai_detected'
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold'
                : 'bg-white border-sand-200 text-sand-600 hover:text-sand-900'
            }`}
          >
            Pending Review
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-2 py-0.5 rounded border whitespace-nowrap ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' // Pastel green
                : 'bg-white border-sand-200 text-sand-600 hover:text-sand-900'
            }`}
          >
            Confirmed
          </button>
        </div>
      </div>

      {/* Detections List */}
      <div className="flex-1 overflow-y-auto divide-y divide-sand-150 p-2 space-y-1.5">
        {filteredDetections.length === 0 ? (
          <div className="p-6 text-center text-xs text-sand-500 font-mono">
            No matching detections found.
          </div>
        ) : (
          filteredDetections.map(det => {
            const isSelected = det.id === selectedDetectionId;
            return (
              <div
                key={det.id}
                onClick={() => onSelectDetection(det.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-400 shadow-xs ring-1 ring-sky-300'
                    : 'bg-white border-sand-200 hover:bg-sand-50 hover:border-sand-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-semibold text-sand-900 leading-tight">
                    {det.class_name}
                  </h4>
                  <ConfidenceBadge confidence={det.confidence} />
                </div>

                <div className="flex items-center justify-between gap-2 mt-2">
                  <PriorityBadge priority={det.priority} />
                  <StatusBadge status={det.status} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
