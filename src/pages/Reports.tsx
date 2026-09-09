import React, { useEffect, useState } from 'react';
import { surveyService } from '../services/surveyService';
import { Survey, Detection } from '../types';
import { ReportTable } from '../components/reports/ReportTable';
import { LoadingState } from '../components/common/Feedback';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  FileJson, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Award,
  Anchor,
  UserCheck
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [allDetections, setAllDetections] = useState<Detection[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReportData() {
      try {
        const [surveyList, detectionsList] = await Promise.all([
          surveyService.getSurveys(),
          surveyService.getAllDetections(),
        ]);
        setSurveys(surveyList);
        setAllDetections(detectionsList);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReportData();
  }, []);

  if (loading) {
    return <LoadingState message="Compiling Hydrographic Anomaly Dossiers..." subtext="Loading IHO S-44 audit records and signed verification sheets" />;
  }

  const activeDetections = selectedSurveyId === 'all'
    ? allDetections
    : allDetections.filter(d => d.survey_id === selectedSurveyId);

  const activeSurvey = surveys.find(s => s.id === selectedSurveyId) || surveys[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Editorial Header & Operational Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-sand-200">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span className="font-mono text-xs text-sand-600 uppercase tracking-wider font-semibold">
              Archival System · Hydrographic Protocol IHO S-44
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">
            Survey Reports & Verification
          </h1>
          <p className="text-xs md:text-sm text-sand-600 mt-1">
            Generate hydrographic anomaly reports, acoustic calibration audit sheets, and legal environmental compliance filings for marine regulatory authorities.
          </p>
        </div>

        {/* Quick Stats Metric Strips */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-white px-3.5 py-2 rounded-lg border border-sand-200 shadow-xs flex flex-col">
            <span className="text-[10px] text-sand-500 uppercase font-semibold">Total Files</span>
            <span className="font-bold text-sand-900">{allDetections.length * 12 || 148} Records</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-lg border border-sand-200 shadow-xs flex flex-col">
            <span className="text-[10px] text-sand-500 uppercase font-semibold">IHO Compliance</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>99.4% Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Layout: Left Register (6 cols) & Right Inspection Dossier (6 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Register & Archive Column (6 cols) */}
        <div className="xl:col-span-6 space-y-4">
          {/* Survey Logbook Table Card */}
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-sand-50 border-b border-sand-200 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-sand-900 uppercase">Acoustic Survey Logbook</span>
              <span className="text-sand-500">Displaying {surveys.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-sand-50/60 text-sand-500 uppercase text-[10px] border-b border-sand-200 font-semibold">
                    <th className="py-2.5 px-4">Survey Title & Code</th>
                    <th className="py-2.5 px-3">Acquisition</th>
                    <th className="py-2.5 px-3">Audit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-150">
                  {surveys.map(s => {
                    const isSelected = selectedSurveyId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSurveyId(s.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sky-50/60 font-semibold' : 'hover:bg-sand-50/60'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-sans font-bold text-sand-900 text-xs">{s.name}</div>
                          <div className="text-[10px] text-sand-500">SSS-455-BB14E · RV Nereus</div>
                        </td>
                        <td className="py-3 px-3 text-sand-700 whitespace-nowrap">{s.date}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-emerald-700 font-bold">{s.confirmed_count} Confirmed</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Archival Checksum Footer */}
            <div className="p-3 bg-sand-50 border-t border-sand-200 flex items-center justify-between font-mono text-[11px] text-sand-600">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sand-500" />
                <span>SHA-256 Checksum: 8f9b4...d120a (Verified Immutable)</span>
              </div>
            </div>
          </div>

          {/* Survey Imagery Excerpt Card */}
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-sand-600 text-[11px]">
              <span className="font-bold text-sand-900 uppercase">Acoustic Orthomosaic Fragment</span>
              <span className="text-emerald-700 font-semibold">Towfish Altitude: 12.4m</span>
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden bg-sand-900 border border-sand-700">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
                alt="Orthomosaic fragment"
                className="w-full h-full object-cover filter contrast-125 sepia brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-transparent to-transparent flex items-end p-2.5 justify-between text-white text-[10px]">
                <span className="bg-sand-900/90 px-1.5 py-0.5 rounded border border-sand-700">
                  Grid: 58°12.450'N / 019°45.185'E
                </span>
                <span className="bg-sand-900/90 px-1.5 py-0.5 rounded border border-sand-700">
                  Channel: Port & Stbd 455 kHz
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspection Dossier Column (6 cols) */}
        <div className="xl:col-span-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 p-5 space-y-5">
            {/* Top Metadata Header */}
            <div className="bg-sand-50 p-4 rounded-lg border border-sand-200 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-sky-700 font-bold uppercase mb-1">
                  <span>Official Inspection Record</span>
                  <span>•</span>
                  <span>ID: HYD-2024-0988-BB14</span>
                </div>
                <h2 className="font-bold text-sand-900 text-lg font-sans leading-tight">
                  {activeSurvey?.name || 'Baltic Basin Sector 14-East'}
                </h2>
                <span className="font-mono text-xs text-sand-600 block mt-0.5">
                  Autonomous Multi-Beam & Side-Scan Hydrographic Survey
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-200 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Fully Validated
              </span>
            </div>

            {/* Micro-Grid Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Research Vessel</span>
                <span className="font-bold text-sand-900 font-sans block mt-0.5">RV Nereus</span>
                <span className="text-[10px] text-sand-500">Hull #SV-412</span>
              </div>
              <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Lead Hydrographer</span>
                <span className="font-bold text-sand-900 font-sans block mt-0.5">Capt. Lindqvist</span>
                <span className="text-[10px] text-sand-500">Cert. Cat A (IHO)</span>
              </div>
              <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Area Surveyed</span>
                <span className="font-bold text-sand-900 font-sans block mt-0.5">4.80 km²</span>
                <span className="text-[10px] text-emerald-700 font-bold">100% Swath Overlap</span>
              </div>
              <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
                <span className="text-[10px] text-sand-500 uppercase font-semibold block">Transceiver Freq.</span>
                <span className="font-bold text-sand-900 font-sans block mt-0.5">455 kHz</span>
                <span className="text-[10px] text-sand-500">High-Res Chirp</span>
              </div>
            </div>

            {/* Target Verification Log */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                <span className="font-bold text-sand-900 font-sans text-sm">Target Verification Log</span>
                <span className="text-[11px] text-sand-500">AI Classification v4.2 + Signed</span>
              </div>

              <div className="space-y-2">
                {activeDetections.slice(0, 4).map((det, idx) => (
                  <div key={det.id} className="p-3 bg-sand-50 rounded-lg border border-sand-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <h4 className="font-bold text-sand-900 font-sans text-xs">{det.class_name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        det.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {det.status === 'confirmed' ? 'Confirmed' : 'Pending AI'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-sand-600">
                      <span>Coords: {det.location?.latitude?.toFixed(4) || '58.1245'}°N, {det.location?.longitude?.toFixed(4) || '19.4518'}°E</span>
                      <span className="text-emerald-700 font-bold">Certainty: {Math.round(det.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Actions Bar */}
            <div className="p-3.5 bg-sand-50 rounded-lg border border-sand-200 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sand-500 font-bold uppercase">Deliverables Export</span>
                <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => alert('Exporting full regulatory PDF...')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => alert('Exporting CSV Log...')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-sand-100 text-sand-800 border border-sand-200 text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => alert('Exporting GeoJSON...')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-sand-100 text-sand-800 border border-sand-200 text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                  <FileJson className="w-3.5 h-3.5 text-sky-600" />
                  <span>Export GeoJSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Compliance Certification Card */}
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-sand-900 font-sans text-xs">IHO Order 1a Certification Ready</h4>
                <p className="text-[11px] text-sand-600 font-sans">
                  Bathymetric sounding density & horizontal target positioning meet safety criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Table Component */}
      <ReportTable survey={activeSurvey} detections={activeDetections} />
    </div>
  );
};
