import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { Detection, Survey } from '../types';
import { MapView } from '../components/map/MapView';
import { LocationSkeleton } from '../components/common/Skeleton';
import { Download, MapPin, Eye, Maximize2, Minimize2 } from 'lucide-react';

export const LocationPage: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('all');
  const [allDetections, setAllDetections] = useState<Detection[]>([]);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'high'>('all');
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [surveysList, detectionsList] = await Promise.all([
          surveyService.getSurveys(),
          surveyService.getAllDetections(),
        ]);
        setSurveys(surveysList);
        setAllDetections(detectionsList);
        if (detectionsList.length > 0) {
          setSelectedDetectionId(detectionsList[0].id);
        }
      } catch (err) {
        console.error('Failed to load location data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LocationSkeleton />;
  }

  const surveyDetections = selectedSurveyId === 'all'
    ? allDetections
    : allDetections.filter(d => d.survey_id === selectedSurveyId);

  const filteredDetections = surveyDetections.filter(d => {
    if (filterStatus === 'confirmed') return d.status === 'confirmed';
    if (filterStatus === 'pending') return d.status === 'ai_detected';
    if (filterStatus === 'high') return d.priority === 'high';
    return true;
  });

  const selectedDetection = allDetections.find(d => d.id === selectedDetectionId) || filteredDetections[0] || null;

  const exportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: filteredDetections.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.location?.longitude || 72.8120, d.location?.latitude || 18.6415],
        },
        properties: {
          id: d.id,
          class_name: d.class_name,
          confidence: d.confidence,
          status: d.status,
          priority: d.priority,
        },
      })),
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hydrographic_anomalies.geojson';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Command & Filter Card */}
      <div className="w-full bg-white shadow-xs rounded-2xl p-5 border border-sand-200 space-y-4">
        {/* Top Header Row: Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-sand-200/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center border border-sky-200 shrink-0 shadow-xs">
              <MapPin className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-sand-900 font-sans tracking-tight">Geospatial Anomaly Map</h1>
              <p className="text-xs text-sand-600 font-sans">Georeferenced acoustic detections across surveyed hydrographic corridors.</p>
            </div>
          </div>

          {/* Right Controls: Swath Selector & GeoJSON Button */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            {/* Survey Selector Dropdown */}
            <div className="relative min-w-[210px]">
              <select
                value={selectedSurveyId}
                onChange={e => setSelectedSurveyId(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 px-3 py-1.5 rounded-xl text-sand-900 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
              >
                <option value="all">All Survey Swaths ({allDetections.length} Targets)</option>
                {surveys.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.detections_count} Targets)
                  </option>
                ))}
              </select>
            </div>

            {/* GeoJSON Export */}
            <button
              onClick={exportGeoJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sand-50 border border-sand-200 text-sky-800 font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              title="Export GeoJSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>GeoJSON</span>
            </button>
          </div>
        </div>

        {/* Bottom Sub-row: Centered Segmented Filter Tabs */}
        <div className="flex justify-center w-full pt-0.5 font-mono text-xs">
          <div className="bg-sand-50/90 p-1 rounded-xl flex items-center justify-center gap-1.5 border border-sand-200 shadow-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center text-center cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-sky-800 shadow-xs border border-sand-200'
                  : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
              }`}
            >
              All ({surveyDetections.length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center text-center gap-2 cursor-pointer ${
                filterStatus === 'confirmed'
                  ? 'bg-white text-emerald-800 shadow-xs border border-sand-200'
                  : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Confirmed ({surveyDetections.filter(d => d.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center text-center gap-2 cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-white text-amber-800 shadow-xs border border-sand-200'
                  : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              Pending ({surveyDetections.filter(d => d.status === 'ai_detected').length})
            </button>
            <button
              onClick={() => setFilterStatus('high')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center text-center gap-2 cursor-pointer ${
                filterStatus === 'high'
                  ? 'bg-white text-rose-800 shadow-xs border border-sand-200'
                  : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              High Priority ({surveyDetections.filter(d => d.priority === 'high').length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Target Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map View Container (8 cols standard, 12 cols expanded) */}
        <div
          className={`transition-all duration-300 ${
            isMapExpanded ? 'lg:col-span-12 h-[750px]' : 'lg:col-span-8 h-[640px]'
          } rounded-2xl overflow-hidden shadow-xs border border-sand-200 relative bg-white flex flex-col`}
        >
          <MapView
            detections={filteredDetections}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={id => setSelectedDetectionId(id)}
            height="100%"
            isExpanded={isMapExpanded}
            onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
          />
        </div>

        {/* Selected Anomaly Dossier Side Panel (4 cols standard, 12 cols expanded) */}
        <div className={`${isMapExpanded ? 'lg:col-span-12' : 'lg:col-span-4'} bg-white rounded-2xl shadow-xs border border-sand-200 p-5 space-y-4 font-mono text-xs transition-all duration-300`}>
          {selectedDetection ? (
            <>
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider block mb-0.5">
                    GEOSPATIAL ANOMALY DOSSIER
                  </span>
                  <h3 className="font-bold text-sand-900 text-base font-sans leading-tight">
                    {selectedDetection.class_name}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  selectedDetection.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : selectedDetection.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {selectedDetection.status === 'confirmed' ? 'Validated' : selectedDetection.status === 'rejected' ? 'Rejected' : 'Pending AI'}
                </span>
              </div>

              {/* Confidence & Classification Center-Aligned Stats */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-sand-50 rounded-xl border border-sand-200 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] text-sand-500 font-bold uppercase tracking-wider mb-0.5">AI CERTAINTY</span>
                  <span className="text-2xl font-extrabold text-emerald-700 font-sans">
                    {Math.round(selectedDetection.confidence * 100)}%
                  </span>
                  <span className="text-[10px] text-sand-500 font-medium">Confidence Score</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] text-sand-500 font-bold uppercase tracking-wider mb-0.5">PRIORITY LEVEL</span>
                  <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full mt-0.5 ${
                    selectedDetection.priority === 'high' ? 'bg-rose-100 text-rose-800 border border-rose-200' : selectedDetection.priority === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {selectedDetection.priority}
                  </span>
                  <span className="text-[10px] text-sand-500 font-medium mt-0.5">Triage Level</span>
                </div>
              </div>

              {/* Geographic Coordinates */}
              <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 space-y-1.5">
                <span className="text-[10px] text-sand-500 font-bold uppercase block text-center tracking-wider">
                  GEOGRAPHIC COORDINATES (WGS-84)
                </span>
                <div className="flex justify-between text-sand-900 pt-1">
                  <span className="text-sand-600">LATITUDE:</span>
                  <span className="font-bold">{selectedDetection.location?.latitude?.toFixed(6) || '18.641500'}° N</span>
                </div>
                <div className="flex justify-between text-sand-900">
                  <span className="text-sand-600">LONGITUDE:</span>
                  <span className="font-bold">{selectedDetection.location?.longitude?.toFixed(6) || '72.812000'}° E</span>
                </div>
              </div>

              {/* Dimensions & Shadow Metadata */}
              <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 space-y-1.5">
                <span className="text-[10px] text-sand-500 font-bold uppercase block text-center tracking-wider">
                  DIMENSIONAL SHADOW ANALYSIS
                </span>
                <div className="flex justify-between text-sand-900 pt-1">
                  <span className="text-sand-600">SHADOW CAST:</span>
                  <span className="font-bold">6.4m Cast Length</span>
                </div>
                <div className="flex justify-between text-sand-900">
                  <span className="text-sand-600">REL. ELEVATION:</span>
                  <span className="font-bold">+1.4m Seabed Height</span>
                </div>
                <div className="flex justify-between text-sand-900">
                  <span className="text-sand-600">WATER DEPTH:</span>
                  <span className="font-bold">48.2m Sounding</span>
                </div>
              </div>

              {/* Action Button */}
              <NavLink
                to={`/surveys/${selectedDetection.survey_id || '1'}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold rounded-xl transition-all shadow-xs text-center cursor-pointer active:scale-98"
              >
                <Eye className="w-4 h-4" />
                <span>Open in Sonar Analysis Workspace</span>
              </NavLink>
            </>
          ) : (
            <div className="py-12 text-center text-sand-500 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-sand-400" />
              <p className="font-sans text-xs">Select an anomaly pin on the geospatial map to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
