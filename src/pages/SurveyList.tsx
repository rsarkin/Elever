import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { Survey } from '../types';
import { LoadingState, EmptyState } from '../components/common/Feedback';
import { Compass, Plus, Search, Layers, Calendar, ArrowRight } from 'lucide-react';

export const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadSurveys() {
      try {
        const list = await surveyService.getSurveys();
        setSurveys(list);
      } catch (err) {
        console.error('Failed to load surveys:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSurveys();
  }, []);

  const filteredSurveys = surveys.filter(s => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.source && s.source.toLowerCase().includes(q));
  });

  if (loading) {
    return <LoadingState message="Loading surveys catalog..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-sand-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            Sonar Surveys Catalog
          </h1>
          <p className="text-xs text-sand-600 mt-1 font-sans">
            Manage side-scan survey passes and process sonar imagery
          </p>
        </div>

        <NavLink
          to="/surveys/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Create New Survey
        </NavLink>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-sand-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search surveys by name or source..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-sand-200 rounded-xl pl-9 pr-4 py-2 text-xs text-sand-900 focus:outline-none focus:border-sky-500 font-sans shadow-xs"
        />
      </div>

      {/* Survey Cards Stack (Horizontal Skyscanner Style) */}
      {filteredSurveys.length === 0 ? (
        <EmptyState
          title="No Surveys Found"
          description="No sonar surveys match your criteria. Create a new survey to upload side-scan sonar files."
          action={
            <NavLink
              to="/surveys/new"
              className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg font-mono shadow-xs"
            >
              Create Survey
            </NavLink>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredSurveys.map(survey => {
            const hasHighPriority = (survey.high_priority_count && survey.high_priority_count > 0) || survey.id === '1';
            const isPending = survey.detections_count > survey.confirmed_count;

            // Situational styling logic
            let theme = {
              borderHover: 'hover:border-emerald-300',
              iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
              badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
              badgeText: 'ALL VERIFIED',
              corridorLine: 'bg-emerald-500',
              corridorBadge: 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold',
              corridorLabel: 'Verified Swath Corridor',
              targetChipBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
              statusPill: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
              statusText: 'Fully Cataloged',
              btnBg: 'bg-sky-600 hover:bg-sky-700 text-white', // Blue button
            };

            if (hasHighPriority) {
              theme = {
                borderHover: 'hover:border-rose-300',
                iconBg: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
                badgeBg: 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold',
                badgeText: 'HIGH PRIORITY FLAG',
                corridorLine: 'bg-rose-500',
                corridorBadge: 'bg-rose-50 text-rose-900 border-rose-200 font-bold',
                corridorLabel: 'Urgent Anomaly Triage',
                targetChipBg: 'bg-rose-50/80 border-rose-200 text-rose-900',
                statusPill: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
                statusText: 'Action Required',
                btnBg: 'bg-rose-600 hover:bg-rose-700 text-white', // Red button ONLY for high priority
              };
            } else if (isPending) {
              theme = {
                borderHover: 'hover:border-amber-400',
                iconBg: 'bg-amber-50 text-amber-800 border-amber-200 group-hover:bg-amber-600 group-hover:text-white',
                badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
                badgeText: 'PENDING REVIEW',
                corridorLine: 'bg-amber-400',
                corridorBadge: 'bg-amber-50 text-amber-900 border-amber-200 font-bold',
                corridorLabel: 'Review In Progress',
                targetChipBg: 'bg-amber-50/80 border-amber-200 text-amber-900',
                statusPill: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
                statusText: 'Verification Pending',
                btnBg: 'bg-sky-600 hover:bg-sky-700 text-white', // Blue button
              };
            }

            return (
              <div
                key={survey.id}
                className={`w-full bg-white border border-sand-200 ${theme.borderHover} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-5`}
              >
                {/* Left Column: Swath Badge & Survey Metadata */}
                <div className="flex items-start gap-4 lg:w-1/3 min-w-[260px]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-xs transition-all ${theme.iconBg}`}>
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 border border-sand-200">
                        #{survey.id}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                        {theme.badgeText}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-sand-900 group-hover:text-sky-700 transition-colors font-sans leading-tight">
                      {survey.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-sand-600 font-mono pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        {survey.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sand-400" />
                        {survey.source || 'Side-Scan Sonar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Column: Skyscanner Swath Timeline & Metrics */}
                <div className="flex-1 px-2 lg:px-6 py-3 lg:py-0 border-y lg:border-y-0 lg:border-x border-sand-200/80 flex flex-col justify-center gap-3">
                  {/* Swath Corridor Timeline Graphic */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-sand-600 font-medium">
                    <span>Swath Start • 58.20°N</span>
                    <div className="flex-1 mx-4 relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-sand-200 rounded-full" />
                      <div className={`absolute inset-x-0 h-0.5 ${theme.corridorLine} rounded-full w-2/3 mx-auto`} />
                      <div className={`absolute px-2.5 py-0.5 text-[10px] font-bold rounded-full border shadow-xs ${theme.corridorBadge}`}>
                        {theme.corridorLabel}
                      </div>
                    </div>
                    <span>Swath End • 19.75°E</span>
                  </div>

                  {/* Metrics Chips */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-sand-50 p-2 rounded-xl border border-sand-200 text-center font-mono">
                      <span className="text-[10px] text-sand-500 font-bold uppercase block tracking-wider">IMAGES</span>
                      <span className="text-sm font-extrabold text-sand-900">{survey.image_count} Passes</span>
                    </div>
                    <div className={`p-2 rounded-xl border text-center font-mono ${theme.targetChipBg}`}>
                      <span className="text-[10px] font-bold uppercase block tracking-wider">AI TARGETS</span>
                      <span className="text-sm font-extrabold">{survey.detections_count} Anomaly</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200 text-center font-mono">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block tracking-wider">CONFIRMED</span>
                      <span className="text-sm font-extrabold text-emerald-800">{survey.confirmed_count} Verified</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Status & Action Button */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-mono text-sand-500 uppercase tracking-wider block font-bold">SITUATION</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border inline-block mt-0.5 ${theme.statusPill}`}>
                      {theme.statusText}
                    </span>
                  </div>

                  <NavLink
                    to={`/surveys/${survey.id}`}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-mono ${theme.btnBg} transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95 shrink-0`}
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
