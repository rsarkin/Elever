import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { DashboardStats, Survey, Detection } from '../types';
import { LoadingState } from '../components/common/Feedback';
import { 
  Compass, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Plus, 
  ArrowRight, 
  Eye, 
  Download,
  Flame,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);
  const [priorityDetections, setPriorityDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [dashStats, surveysList, allDetections] = await Promise.all([
          surveyService.getDashboardStats(),
          surveyService.getSurveys(),
          surveyService.getAllDetections(),
        ]);
        setStats(dashStats);
        setRecentSurveys(surveysList);
        setPriorityDetections(allDetections.filter(d => d.priority === 'high' || d.status === 'ai_detected'));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleReviewNow = (surveyId: string, detectionId: string) => {
    setReviewingId(detectionId);
    setTimeout(() => {
      navigate(`/surveys/${surveyId}`);
    }, 400);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Survey ID,Name,Date,Detections,Confirmed\n" +
      recentSurveys.map(s => `${s.id},"${s.name}",${s.date},${s.detections_count},${s.confirmed_count}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hydrographic_surveys_manifest.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !stats) {
    return <LoadingState message="Connecting to Hydrographic Acoustic Feeds..." subtext="Loading active transect metadata and sonar waterfall feeds" />;
  }

  return (
    <div className="space-y-6">
      {/* Operational Header & Quick Switcher Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-2 border-b border-sand-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-sand-600 uppercase tracking-wider font-semibold">
              Acoustic Survey Console • Phase IV
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">Overview</h1>
          <p className="text-xs md:text-sm text-sand-600 mt-1">
            Review your latest side-scan sonar surveys and AI-detected anomalies across Scandinavian littoral basins.
          </p>
        </div>

        {/* Quick Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl shadow-xs border border-sand-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'active' ? 'bg-sand-100 text-sky-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            Active Transects
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'archived' ? 'bg-sand-100 text-sky-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            Archived Feeds
          </button>
          <div className="h-4 w-px bg-sand-200 mx-1" />
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sand-700 hover:text-sky-800 rounded-lg transition-colors font-semibold"
            title="Export Hydrographic Manifest CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* 1. Minimalist Instrument Metrics Strip */}
      <div className="w-full bg-white rounded-xl shadow-xs border border-sand-200 p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Metric 1 */}
          <div className="flex flex-col justify-between pr-4 border-r border-sand-200/60">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono text-[11px] text-sand-500 uppercase tracking-wider font-semibold">Surveys</span>
              <Compass className="w-4 h-4 text-sand-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">{stats.total_surveys}</span>
              <span className="font-mono text-xs text-sand-500">active transects</span>
            </div>
            <div className="w-full bg-sand-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col justify-between pr-4 border-r border-sand-200/60">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono text-[11px] text-sand-500 uppercase tracking-wider font-semibold">Detections</span>
              <Layers className="w-4 h-4 text-sand-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">{stats.images_analyzed * 12 || 142}</span>
              <span className="font-mono text-xs text-sand-500">targets mapped</span>
            </div>
            <div className="w-full bg-sand-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-sky-700 h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col justify-between pr-4 border-r border-sand-200/60">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono text-[11px] text-amber-700 uppercase tracking-wider font-semibold">Pending Review</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">{stats.high_priority_detections}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-semibold border border-amber-200">
                Operator Req.
              </span>
            </div>
            <div className="w-full bg-sand-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }} />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-mono text-[11px] text-emerald-700 uppercase tracking-wider font-semibold">Confirmed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">{stats.confirmed_detections}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-semibold border border-emerald-200">
                Validated
              </span>
            </div>
            <div className="w-full bg-sand-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 8 Columns (Table & Swath Waterfall), Right 4 Columns (Urgent Triage Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Hydrographic Transects Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600" />
              <h2 className="text-base md:text-lg font-bold text-sand-900 font-sans">Recent Hydrographic Transects</h2>
            </div>
            <span className="font-mono text-xs text-sand-500">Telemetry updated: 4m ago</span>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-sand-50 text-sand-600 border-b border-sand-200 uppercase text-[10px] font-semibold">
                    <th className="py-3 px-4">Survey Name & Swath</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Pings / Tiles</th>
                    <th className="py-3 px-3">Detections</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-150">
                  {recentSurveys.map((survey, index) => (
                    <tr key={survey.id} className="hover:bg-sand-50/70 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sand-900 group-hover:text-sky-700 transition-colors text-sm">
                            {survey.name}
                          </span>
                          <span className="text-[10px] text-sand-500">
                            {index % 2 === 0 ? '59°18\'22"N • 19°44\'10"E • SSS-455kHz' : '57°32\'04"N • 11°12\'49"E • SSS-900kHz'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-sand-700">{survey.date}</td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sand-900">{survey.image_count * 16}</span>
                          <span className="text-[10px] text-sand-500">tiles</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sand-900">{survey.detections_count}</span>
                          {survey.detections_count - survey.confirmed_count > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-200">
                              {survey.detections_count - survey.confirmed_count} pending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                              all verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {survey.detections_count - survey.confirmed_count > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 font-medium text-[11px] border border-sky-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
                            In Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <NavLink
                          to={`/surveys/${survey.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold transition-colors shadow-xs"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-sand-50 px-4 py-2.5 flex items-center justify-between font-mono text-xs text-sand-600 border-t border-sand-200">
              <span>Displaying {recentSurveys.length} active runs • Towfish Speed: 3.8 knots steady</span>
              <NavLink to="/surveys" className="text-sky-700 hover:underline font-bold flex items-center gap-1">
                <span>View all surveys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>

          {/* Active Towfish Acoustic Swath Waterfall Card */}
          <div className="bg-white rounded-xl shadow-xs border border-sand-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-sand-900 text-base font-sans">
                  Active Swath Waterfall • Baltic Transect 04-B
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-sand-500">Range: 75m Port / 75m Stbd</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">Live Feed</span>
              </div>
            </div>

            {/* Waterfall Sonar Canvas Container */}
            <div className="relative w-full h-52 bg-sand-900 rounded-lg overflow-hidden flex items-center justify-center border border-sand-700">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                alt="Active side scan sonar swath feed"
                className="w-full h-full object-cover filter contrast-125 sepia brightness-90 opacity-90"
              />

              {/* Nadir Blind Zone Center Line Overlay */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-sky-400/50 -translate-x-1/2 flex flex-col justify-between py-2 pointer-events-none">
                <span className="font-mono text-[9px] text-white bg-sand-900/80 px-1 rounded -translate-x-1/2 font-semibold">
                  Nadir
                </span>
                <span className="font-mono text-[9px] text-white bg-sand-900/80 px-1 rounded -translate-x-1/2 font-semibold">
                  Alt 12m
                </span>
              </div>

              {/* Target Bounding Reticle Overlay */}
              <div className="absolute top-1/4 right-1/3 w-32 h-20 rounded border-2 border-dashed border-amber-400 bg-amber-500/10 backdrop-blur-[1px] flex flex-col justify-between p-1.5 shadow-lg">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="bg-sand-900/90 text-amber-300 px-1 rounded font-bold">TRG-882</span>
                  <span className="text-white font-bold">91% Conf</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-300 bg-sand-900/80 px-1 rounded truncate font-medium">
                  Trawl Net / Gear
                </span>
              </div>

              {/* Telemetry Overlay at Bottom Left */}
              <div className="absolute bottom-2 left-3 bg-sand-900/85 px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-2 font-mono text-[11px] text-white border border-sand-700">
                <span>Frequency: 455 kHz</span>
                <span>•</span>
                <span>Heading: 042°</span>
                <span>•</span>
                <span className="text-emerald-400">Tow Speed: 3.8 kn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Urgent Triage Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-sand-900 font-sans">Needs Review</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-xs font-semibold border border-amber-200">
              {priorityDetections.length} High Priority
            </span>
          </div>

          <p className="text-xs text-sand-600 -mt-1 font-sans">
            Targets exceeding computer vision anomaly thresholds requiring hydrographer verification.
          </p>

          <div className="space-y-3">
            {priorityDetections.slice(0, 3).map((det, index) => {
              const surveyId = det.survey_id || recentSurveys[0]?.id || '1';
              const isReviewing = reviewingId === det.id;

              return (
                <div
                  key={det.id}
                  className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-3 border border-sand-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                        {index === 0 ? 'Acoustic Shadow Anomaly' : index === 1 ? 'Hard Reflector Anomaly' : 'Uncategorized Linear Trace'}
                      </span>
                      <h3 className="font-bold text-sand-900 text-sm font-sans group-hover:text-sky-700 transition-colors leading-tight">
                        {det.class_name}
                      </h3>
                      <span className="font-mono text-[11px] text-sand-500">
                        {index === 0 ? 'Kattegat Shoal • Depth 38.4m' : index === 1 ? 'Baltic Transect 04-B • Depth 64.1m' : 'Dogger Bank • Depth 29.5m'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 font-mono">
                      <span className="text-sm font-bold text-emerald-700">{Math.round(det.confidence * 100)}%</span>
                      <span className="text-[10px] text-sand-500">AI Certainty</span>
                    </div>
                  </div>

                  {/* Sonar Image Crop Container */}
                  <div className="flex items-center gap-3 bg-sand-50 p-2.5 rounded-lg border border-sand-200">
                    <div className="w-16 h-14 rounded bg-sand-900 shrink-0 overflow-hidden relative border border-sand-300">
                      <img
                        src={det.thumbnail || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80"}
                        alt={det.class_name}
                        className="w-full h-full object-cover filter contrast-125 sepia"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0 text-xs font-mono space-y-0.5">
                      <div className="text-sand-900 font-semibold truncate">
                        Shadow length: {index === 0 ? '4.8m' : index === 1 ? '3.6m' : '2.1m'}
                      </div>
                      <div className="text-sand-600 text-[11px] truncate">
                        Rel. elevation: {index === 0 ? '+1.2m' : index === 1 ? '+3.4m' : 'Flush / Trench'}
                      </div>
                      <div className="text-sand-500 text-[10px]">Flagged Oct 24, 08:42 UTC</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono text-xs">
                    <span className="text-sand-600 text-[11px]">
                      Tag: {index === 0 ? 'Netting / Synthetic' : index === 1 ? 'Structural / Ferrous' : 'Cable / Pipeline'}
                    </span>
                    <button
                      onClick={() => handleReviewNow(surveyId, det.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all shadow-xs ${
                        isReviewing
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-600 hover:bg-sky-700 text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isReviewing ? 'Opening Workspace...' : 'Review Now'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Streamlined Triage Queue Banner */}
          <div className="bg-sand-50 rounded-xl p-3.5 flex items-center justify-between border border-sand-200">
            <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-sand-800 font-semibold">
              <Activity className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">15 low-confidence targets queued</span>
            </div>
            <NavLink
              to="/surveys"
              className="px-3 py-1 bg-white hover:bg-sand-100 border border-sand-200 text-sky-700 font-mono text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Batch Triage
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
