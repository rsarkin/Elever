import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { Detection, Survey } from '../types';
import { MapView } from '../components/map/MapView';
import { LoadingState } from '../components/common/Feedback';
import { 
  Download, 
  MapPin, 
  Eye
} from 'lucide-react';

export const LocationPage: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('all');
  const [allDetections, setAllDetections] = useState<Detection[]>([]);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'high'>('all');
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
    return <LoadingState message="Loading Hydrographic Spatial Map..." subtext="Rendering bathymetric vector grids and georeferenced anomaly pins" />;
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
          coordinates: [d.location?.longitude || 19.75, d.location?.latitude || 58.20],
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
      {/* Top Command & Filter Bar */}
      <div className="w-full bg-white shadow-xs rounded-xl p-4 md:p-5 border border-sand-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full xl:w-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-sky-700 uppercase font-semibold">Hydrographic Spatial View</span>
              <span className="text-sand-400 font-mono text-xs">•</span>
              <span className="font-mono text-xs text-emerald-700 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time SSS Link Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-sand-900 font-sans tracking-tight">Geospatial Anomaly Map</h1>
            <p className="text-xs text-sand-600 font-sans">Georeferenced acoustic detections across surveyed hydrographic corridors.</p>
          </div>

          <div className="h-8 w-px bg-sand-200 hidden sm:block" />

          {/* Survey Selector Dropdown */}
          <div className="relative min-w-[240px] font-mono text-xs">
            <select
              value={selectedSurveyId}
              onChange={e => setSelectedSurveyId(e.target.value)}
              className="w-full bg-sand-50 border border-sand-200 px-3 py-2 rounded-lg text-sand-900 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
            >
              <option value="all">All Survey Swaths ({allDetections.length} Targets)</option>
              {surveys.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.detections_count} Targets)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills & GIS Export Options */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-start xl:justify-end font-mono text-xs">
          <div className="bg-sand-50 p-1 rounded-lg flex items-center gap-1 border border-sand-200">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterStatus === 'all' ? 'bg-white text-sky-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
              }`}
            >
              All ({surveyDetections.length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                filterStatus === 'confirmed' ? 'bg-white text-emerald-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Confirmed ({surveyDetections.filter(d => d.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                filterStatus === 'pending' ? 'bg-white text-amber-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Pending ({surveyDetections.filter(d => d.status === 'ai_detected').length})
            </button>
            <button
              onClick={() => setFilterStatus('high')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                filterStatus === 'high' ? 'bg-white text-rose-800 shadow-xs border border-sand-200' : 'text-sand-600 hover:text-sand-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High Priority ({surveyDetections.filter(d => d.priority === 'high').length})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={exportGeoJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sand-50 border border-sand-200 text-sky-800 font-bold rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>GeoJSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Target Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map View Container (8 cols) */}
        <div className="lg:col-span-8 h-[640px] rounded-xl overflow-hidden shadow-sm border border-sand-200 relative bg-white flex flex-col">
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xs z-20 border border-sand-200 flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-sand-900">RV NEREUS • TOWFISH SSS-455</span>
            </div>
            <span className="text-sand-300">•</span>
            <span className="text-sand-600">ALT: <strong className="text-sand-900">8.4m</strong></span>
            <span className="text-sand-300">•</span>
            <span className="text-sand-600">SPD: <strong className="text-sand-900">3.8 kn</strong></span>
          </div>

          <MapView
            detections={filteredDetections}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={id => setSelectedDetectionId(id)}
            height="100%"
          />
        </div>

        {/* Selected Anomaly Dossier Side Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-sand-200 p-5 space-y-4 font-mono text-xs">
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

              {/* Confidence & Classification */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-sand-50 rounded-lg border border-sand-200">
                <div>
                  <span className="text-[10px] text-sand-500 font-semibold block mb-0.5">AI CERTAINTY</span>
                  <span className="text-base font-bold text-emerald-700">
                    {Math.round(selectedDetection.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-sand-500 font-semibold block mb-0.5">PRIORITY LEVEL</span>
                  <span className={`text-xs font-bold uppercase ${
                    selectedDetection.priority === 'high' ? 'text-rose-700' : selectedDetection.priority === 'medium' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {selectedDetection.priority} Priority
                  </span>
                </div>
              </div>

              {/* Geographic Coordinates */}
              <div className="p-3 bg-sand-50 rounded-lg border border-sand-200 space-y-1.5">
                <span className="text-[10px] text-sand-500 font-bold uppercase block">
                  GEOGRAPHIC COORDINATES (WGS-84)
                </span>
                <div className="flex justify-between text-sand-900">
                  <span className="text-sand-600">LATITUDE:</span>
                  <span className="font-bold">{selectedDetection.location?.latitude?.toFixed(6) || '58.204500'}° N</span>
                </div>
                <div className="flex justify-between text-sand-900">
                  <span className="text-sand-600">LONGITUDE:</span>
                  <span className="font-bold">{selectedDetection.location?.longitude?.toFixed(6) || '19.752180'}° E</span>
                </div>
              </div>

              {/* Dimensions & Shadow Metadata */}
              <div className="p-3 bg-sand-50 rounded-lg border border-sand-200 space-y-1.5">
                <span className="text-[10px] text-sand-500 font-bold uppercase block">
                  DIMENSIONAL SHADOW ANALYSIS
                </span>
                <div className="flex justify-between text-sand-900">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-semibold rounded-lg transition-colors shadow-xs"
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
