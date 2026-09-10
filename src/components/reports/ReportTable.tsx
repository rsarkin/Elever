import React, { useState } from 'react';
import { Detection, Survey } from '../../types';
import { PriorityBadge, StatusBadge, ConfidenceBadge } from '../common/Badges';
import { FileJson, FileSpreadsheet, Search } from 'lucide-react';

interface ReportTableProps {
  survey?: Survey | null;
  detections: Detection[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ survey, detections }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDetections = detections.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchClass = d.class_name.toLowerCase().includes(q);
      const matchId = d.id.toLowerCase().includes(q);
      if (!matchClass && !matchId) return false;
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Survey ID', 'Detection ID', 'Class Name', 'Confidence (%)', 'Priority', 'Status', 'Latitude', 'Longitude', 'Notes'];
    const rows = filteredDetections.map(d => [
      d.survey_id,
      d.id,
      `"${d.class_name.replace(/"/g, '""')}"`,
      `${Math.round(d.confidence * 100)}%`,
      d.priority.toUpperCase(),
      d.status,
      d.location?.latitude ?? 'N/A',
      d.location?.longitude ?? 'N/A',
      `"${(d.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ELVER_Anomaly_Report_${survey?.name.replace(/\s+/g, '_') || 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const reportPayload = {
      report_generated_at: new Date().toISOString(),
      survey: survey ? {
        id: survey.id,
        name: survey.name,
        date: survey.date,
        source: survey.source,
      } : null,
      detections_count: filteredDetections.length,
      detections: filteredDetections.map(d => ({
        id: d.id,
        class_name: d.class_name,
        confidence: d.confidence,
        priority: d.priority,
        status: d.status,
        bbox: d.bbox,
        dimensions: d.dimensions || null,
        location: d.location ? {
          latitude: d.location.latitude,
          longitude: d.location.longitude,
        } : { latitude: null, longitude: null },
        notes: d.notes || '',
      })),
    };

    const jsonString = JSON.stringify(reportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ELVER_Report_${survey?.name.replace(/\s+/g, '_') || 'Export'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-sand-200 bg-sand-50/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-sand-900 flex items-center gap-2 font-sans">
            <span>Hydrographic Anomaly Observations</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 border border-sand-200 font-semibold">
              {filteredDetections.length} Target(s)
            </span>
          </h3>
          <p className="text-xs text-sand-600 mt-0.5 font-sans">
            Structured side-scan acoustic observations and verified target classification log
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-white hover:bg-sand-50 text-emerald-800 border border-sand-200 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-white hover:bg-sand-50 text-sky-800 border border-sand-200 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FileJson className="w-3.5 h-3.5 text-sky-600" />
            <span>GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-4 py-3 bg-sand-50/40 border-b border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-sand-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search anomaly records..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-sand-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-sand-900 focus:outline-none focus:border-sky-500 font-sans shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-sand-500 mr-1 hidden sm:inline font-semibold">STATUS:</span>
          {['all', 'confirmed', 'ai_detected', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg border capitalize text-[11px] font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-sky-800 shadow-xs border-sand-200'
                  : 'bg-transparent border-transparent text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
              }`}
            >
              {st === 'ai_detected' ? 'Pending AI' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabular View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-sand-200 bg-sand-50/60 text-sand-600 font-semibold uppercase text-[10px]">
              <th className="py-3 px-4">Target ID</th>
              <th className="py-3 px-4">Object Class</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4">Coordinates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-150">
            {filteredDetections.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sand-600 font-sans text-xs">
                  No detection records match the current filter.
                </td>
              </tr>
            ) : (
              filteredDetections.map(det => (
                <tr key={det.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3 px-4 text-sky-700 font-bold">#{det.id.slice(-6)}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-sand-900">{det.class_name}</td>
                  <td className="py-3 px-4"><ConfidenceBadge confidence={det.confidence} /></td>
                  <td className="py-3 px-4"><PriorityBadge priority={det.priority} /></td>
                  <td className="py-3 px-4"><StatusBadge status={det.status} /></td>
                  <td className="py-3 px-4 text-sand-800">
                    {det.location?.latitude != null && det.location?.longitude != null ? (
                      `${det.location.latitude.toFixed(4)}°, ${det.location.longitude.toFixed(4)}°`
                    ) : (
                      <span className="text-amber-700 text-[11px] font-sans font-medium">Location unavailable</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
