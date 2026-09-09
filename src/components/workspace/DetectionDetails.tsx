import React, { useState, useEffect } from 'react';
import { Detection, VerificationStatus } from '../../types';
import { PriorityBadge, StatusBadge, ConfidenceBadge } from '../common/Badges';
import { MapPin, Check, X, Shield, FileText, Compass, AlertCircle } from 'lucide-react';

interface DetectionDetailsProps {
  detection: Detection | null;
  onUpdateStatus: (id: string, status: VerificationStatus, notes?: string) => void;
}

export const DetectionDetails: React.FC<DetectionDetailsProps> = ({
  detection,
  onUpdateStatus,
}) => {
  const [notesText, setNotesText] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

  useEffect(() => {
    if (detection) {
      setNotesText(detection.notes || '');
    }
  }, [detection]);

  if (!detection) {
    return (
      <div className="h-full bg-white border border-sand-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
        <Compass className="w-8 h-8 text-sand-400 mb-2" />
        <h4 className="text-sm font-semibold text-sand-800">No Target Selected</h4>
        <p className="text-xs text-sand-600 max-w-xs mt-1">
          Select a detection box on the sonar canvas or item from the detection list to inspect target parameters and perform operator verification.
        </p>
      </div>
    );
  }

  const handleConfirm = () => {
    onUpdateStatus(detection.id, 'confirmed', notesText);
  };

  const handleReject = () => {
    onUpdateStatus(detection.id, 'rejected', notesText);
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateStatus(detection.id, detection.status, notesText);
    setTimeout(() => setIsSavingNotes(false), 400);
  };

  const hasLocation = detection.location?.latitude != null && detection.location?.longitude != null;

  return (
    <div className="flex flex-col h-full bg-white border border-sand-200 rounded-xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 border-b border-sand-200 bg-sand-50/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-sky-700 tracking-wider uppercase font-bold">
            TARGET INSPECTOR #{detection.id.slice(-4)}
          </span>
          <StatusBadge status={detection.status} />
        </div>
        <h3 className="text-base font-bold text-sand-900">{detection.class_name}</h3>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Confidence & Priority Section */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-sand-50/60 rounded-lg border border-sand-200">
          <div>
            <span className="text-[11px] text-sand-600 font-semibold block mb-1">AI CONFIDENCE</span>
            <ConfidenceBadge confidence={detection.confidence} className="text-sm" />
          </div>
          <div>
            <span className="text-[11px] text-sand-600 font-semibold block mb-1">PRIORITY LEVEL</span>
            <PriorityBadge priority={detection.priority} />
          </div>
        </div>

        {/* Human Review Status Disclaimer */}
        <div className="p-3 rounded-lg border border-sand-200 bg-sand-50/40">
          <span className="text-[11px] text-sand-700 block mb-1 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            HUMAN-IN-THE-LOOP STATUS
          </span>
          <p className="text-[11px] text-sand-800 font-sans leading-relaxed">
            {detection.status === 'ai_detected' && (
              <span className="text-sky-800 font-medium">
                Awaiting operator verification. Select Confirm or Reject to finalize classification for map output.
              </span>
            )}
            {detection.status === 'confirmed' && (
              <span className="text-emerald-800 font-bold">
                Confirmed by survey operator. Target validated for report export.
              </span>
            )}
            {detection.status === 'rejected' && (
              <span className="text-rose-700 font-medium">
                Rejected by survey operator (classified as acoustic shadow / natural rock).
              </span>
            )}
          </p>
        </div>

        {/* Location & Metadata Section */}
        <div className="p-3 rounded-lg bg-sand-50/60 border border-sand-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-sand-700 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              GEOGRAPHIC LOCATION
            </span>
          </div>

          {hasLocation ? (
            <div className="text-sand-900 font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-sand-600">LATITUDE:</span>
                <span className="font-semibold">{detection.location!.latitude!.toFixed(6)}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-600">LONGITUDE:</span>
                <span className="font-semibold">{detection.location!.longitude!.toFixed(6)}° E</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-800 text-xs py-1 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Location unavailable (No GPS metadata in sonar header)</span>
            </div>
          )}

          {detection.dimensions && (
            <div className="pt-2 border-t border-sand-200 text-sand-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-sand-600">ESTIMATED WIDTH:</span>
                <span className="font-semibold">{detection.dimensions.width ?? 'N/A'} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-600">ESTIMATED HEIGHT:</span>
                <span className="font-semibold">{detection.dimensions.height ?? 'N/A'} m</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-sand-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            OPERATOR NOTES
          </label>
          <textarea
            rows={3}
            value={notesText}
            onChange={e => setNotesText(e.target.value)}
            placeholder="Add operational observations (e.g. acoustic shadow characteristics, seabed depth...)"
            className="w-full bg-white border border-sand-200 rounded-lg p-2.5 text-xs text-sand-900 font-sans focus:outline-none focus:border-sky-500 shadow-xs"
          />
          <button
            onClick={handleSaveNotes}
            className="text-[11px] font-mono font-semibold text-sky-700 hover:text-sky-800 transition-colors block text-right w-full"
          >
            {isSavingNotes ? 'Saving Notes...' : 'Save Notes'}
          </button>
        </div>
      </div>

      {/* Verification Actions Footer */}
      <div className="p-3.5 border-t border-sand-200 bg-sand-50/80 grid grid-cols-2 gap-2.5">
        <button
          onClick={handleReject}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-colors border ${
            detection.status === 'rejected'
              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
          }`}
        >
          <X className="w-4 h-4" />
          Reject Target
        </button>

        <button
          onClick={handleConfirm}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-colors border ${
            detection.status === 'confirmed'
              ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs' // Soft Pastel Green Confirm Button
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}
        >
          <Check className="w-4 h-4" />
          Confirm Target
        </button>
      </div>
    </div>
  );
};
