import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { DashboardStats, Survey, Detection } from '../types';
import { LoadingState } from '../components/common/Feedback';
import { 
  Compass, 
  Activity, 
  AlertTriangle, 
  Layers, 
  Plus, 
  ArrowRight, 
  Eye, 
  Download,
  Flame,
  Radio,
  FileSpreadsheet,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);
  const [priorityDetections, setPriorityDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isViewAllReview, setIsViewAllReview] = useState<boolean>(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState<boolean>(false);
  const [telemetryTime, setTelemetryTime] = useState<string>("4m ago");

  const handleRefreshTelemetry = () => {
    setIsRefreshingTelemetry(true);
    setTimeout(() => {
      setIsRefreshingTelemetry(false);
      setTelemetryTime("Just now");
    }, 600);
  };

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
      {/* Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-sand-200/80 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight uppercase">WELCOME TO THE BRIDGE !</h1>
          <p className="text-xs md:text-sm text-sand-600 mt-1">
            Review your latest side-scan sonar surveys and AI-detected anomalies across Scandinavian littoral basins.
          </p>
        </div>

        <div>
          <NavLink
            to="/surveys/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Survey</span>
          </NavLink>
        </div>
      </div>

      {/* 1. Minimalist Instrument Metrics Strip */}
      <div className="w-full bg-white rounded-2xl shadow-xs border border-sand-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1 */}
          <div className="flex flex-col items-center justify-between text-center px-4 md:border-r border-sand-200/70 space-y-2">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <Compass className="w-3.5 h-3.5 text-sand-400" />
              <span className="font-mono text-[11px] text-sand-500 uppercase tracking-wider font-semibold">Surveys</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-sand-900 font-sans tracking-tight leading-none mb-1">
                {stats.total_surveys}
              </span>
              <span className="font-mono text-xs text-sand-500 font-medium">active transects</span>
            </div>
            <div className="w-full max-w-[180px] bg-sand-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center justify-between text-center px-4 md:border-r border-sand-200/70 space-y-2">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <Layers className="w-3.5 h-3.5 text-sand-400" />
              <span className="font-mono text-[11px] text-sand-500 uppercase tracking-wider font-semibold">Detections</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-sand-900 font-sans tracking-tight leading-none mb-1">
                {stats.images_analyzed * 12 || 142}
              </span>
              <span className="font-mono text-xs text-sand-500 font-medium">targets mapped</span>
            </div>
            <div className="w-full max-w-[180px] bg-sand-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-700 h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center justify-between text-center px-4 space-y-2">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="font-mono text-[11px] text-amber-700 uppercase tracking-wider font-semibold">Pending Review</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-extrabold text-sand-900 font-sans tracking-tight leading-none mb-1">
                {stats.high_priority_detections}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-semibold border border-amber-200">
                Operator Req.
              </span>
            </div>
            <div className="w-full max-w-[180px] bg-sand-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 8 Columns (Table & Swath Waterfall), Right 4 Columns (Urgent Triage Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
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

          {/* Recent Hydrographic Transects Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-600" />
              <h2 className="text-base md:text-lg font-bold text-sand-900 font-sans">Recent Hydrographic Transects</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl shadow-xs border border-sand-200 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-lg font-semibold bg-sand-100 text-sky-800 border border-sand-200">
                Active Transects
              </div>
              <div className="h-4 w-px bg-sand-200 mx-0.5" />
              <button
                onClick={exportCSV}
                className="flex items-center gap-1 px-2.5 py-1 text-sand-700 hover:text-sky-800 rounded-lg transition-colors font-semibold cursor-pointer"
                title="Export Hydrographic Manifest CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                <span>CSV</span>
              </button>
            </div>
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

            <div className="bg-sand-50 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs text-sand-600 border-t border-sand-200 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Displaying {recentSurveys.length} active runs</span>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-sand-700 font-semibold">
                  <span>Telemetry updated: {telemetryTime}</span>
                  <button
                    onClick={handleRefreshTelemetry}
                    className="p-1 hover:bg-sand-200 text-sky-700 hover:text-sky-900 rounded transition-colors cursor-pointer flex items-center justify-center"
                    title="Refresh Telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTelemetry ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <NavLink to="/surveys" className="text-sky-700 hover:underline font-bold flex items-center gap-1 shrink-0">
                <span>View all surveys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Urgent Triage Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-base font-bold text-red-950 font-sans">Needs Review</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-mono text-xs font-semibold border border-red-300">
                {priorityDetections.length} High Priority
              </span>
            </div>

            <p className="text-xs text-red-900/80 font-sans">
              Targets exceeding computer vision anomaly thresholds requiring hydrographer verification.
            </p>

            <div className="space-y-3">
              {(isViewAllReview ? priorityDetections : priorityDetections.slice(0, 1)).map((det, index) => {
                const surveyId = det.survey_id || recentSurveys[0]?.id || '1';
                const isReviewing = reviewingId === det.id;

                return (
                  <div
                    key={det.id}
                    className="bg-white rounded-xl shadow-xs p-4 flex flex-col gap-3 border border-red-200 hover:border-red-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-red-700 font-bold uppercase tracking-wider">
                          {index === 0 ? 'Acoustic Shadow Anomaly' : index === 1 ? 'Hard Reflector Anomaly' : 'Uncategorized Linear Trace'}
                        </span>
                        <h3 className="font-bold text-sand-900 text-sm font-sans group-hover:text-red-700 transition-colors leading-tight">
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
                    <div className="flex items-center gap-3 bg-red-50/40 p-2.5 rounded-lg border border-red-100">
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
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isReviewing ? 'Opening Workspace...' : 'Review Now'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {priorityDetections.length > 1 && (
                <div className="flex justify-center pt-1">
                  <button
                    onClick={() => setIsViewAllReview(!isViewAllReview)}
                    className="py-1 px-3.5 bg-sky-600 hover:bg-sky-700 text-white border border-sky-500 rounded-full text-[11px] font-mono font-semibold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>{isViewAllReview ? 'Collapse' : `View All (${priorityDetections.length})`}</span>
                    <ChevronDown className={`w-3 h-3 text-white transition-transform duration-200 ${isViewAllReview ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
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
