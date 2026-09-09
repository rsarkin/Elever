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

      {/* Survey Cards Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSurveys.map(survey => (
            <div
              key={survey.id}
              className="bg-white border border-sand-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-sand-300 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-sand-900 group-hover:text-sky-700 transition-colors">
                    {survey.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sand-100 text-sand-600 border border-sand-200 shrink-0 font-semibold">
                    #{survey.id}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-sand-600 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{survey.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-sand-400" />
                    <span>{survey.source || 'Standard Sonar Survey'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-sand-50/60 border border-sand-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-sand-500 block font-medium">IMAGES</span>
                    <span className="text-sand-900 font-bold">{survey.image_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sand-500 block font-medium">TARGETS</span>
                    <span className="text-sky-700 font-bold">{survey.detections_count}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sand-500 block font-medium">CONFIRMED</span>
                    <span className="text-emerald-700 font-bold">{survey.confirmed_count}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-sand-200 flex justify-end">
                <NavLink
                  to={`/surveys/${survey.id}`}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 hover:text-sky-800 transition-colors"
                >
                  Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
