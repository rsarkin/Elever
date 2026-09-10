import React, { useEffect, useRef, useState } from 'react';
import { Detection } from '../../types';
import L from 'leaflet';
import { AlertCircle, Compass, Layers, MapPin, Maximize2, Minimize2, Plus, Minus, RotateCcw } from 'lucide-react';

interface MapViewProps {
  detections: Detection[];
  selectedDetectionId?: string | null;
  onSelectDetection?: (id: string) => void;
  height?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  detections,
  selectedDetectionId,
  onSelectDetection,
  height = '100%',
  isExpanded = false,
  onToggleExpand,
}) => {
  const [mapMode, setMapMode] = useState<'bathymetric' | 'gis'>('bathymetric');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const validGeolocatedDetections = detections.filter(
    d => d.location && d.location.latitude != null && d.location.longitude != null
  );

  const handleZoomIn = () => {
    if (mapMode === 'gis' && mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    } else {
      setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
    }
  };

  const handleZoomOut = () => {
    if (mapMode === 'gis' && mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 1));
    }
  };

  useEffect(() => {
    if (mapMode !== 'gis' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = validGeolocatedDetections.length > 0
        ? [validGeolocatedDetections[0].location!.latitude!, validGeolocatedDetections[0].location!.longitude!]
        : [58.2045, 19.7521];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (validGeolocatedDetections.length === 0) return;

    const bounds: [number, number][] = [];

    validGeolocatedDetections.forEach(det => {
      const lat = det.location!.latitude!;
      const lng = det.location!.longitude!;
      bounds.push([lat, lng]);

      let iconColor = '#0284C7';
      if (det.priority === 'high') iconColor = '#DC2626';
      else if (det.priority === 'medium') iconColor = '#D97706';
      else if (det.priority === 'low') iconColor = '#16A34A';

      const isSelected = det.id === selectedDetectionId;

      const customIcon = L.divIcon({
        className: 'custom-sonar-marker',
        html: `
          <div style="
            width: ${isSelected ? '28px' : '22px'};
            height: ${isSelected ? '28px' : '22px'};
            background-color: ${iconColor};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="width: 6px; height: 6px; background-color: #FFFFFF; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <div style="font-size: 11px; font-weight: 700; color: #0284C7; margin-bottom: 2px;">${det.class_name}</div>
          <div style="font-size: 10px; color: #574831; margin-bottom: 6px;">CONFIDENCE: ${Math.round(det.confidence * 100)}%</div>
          <div style="font-size: 10px; color: #211B10; font-family: monospace;">
            LAT: ${lat.toFixed(5)}° N<br/>
            LNG: ${lng.toFixed(5)}° E
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectDetection) onSelectDetection(det.id);
      });

      markersRef.current[det.id] = marker;
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [detections, selectedDetectionId, mapMode]);

  return (
    <div className="w-full h-full relative flex flex-col bg-sand-900 overflow-hidden">
      {/* Top Map HUD Overlay Header Bar */}
      <div className="absolute top-3 inset-x-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none font-mono text-xs">
        {/* Left: Telemetry Data */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-sand-200 flex items-center gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-sand-900">RV NEREUS • TOWFISH SSS-455</span>
          </div>
          <span className="text-sand-300">•</span>
          <span className="text-sand-600">ALT: <strong className="text-sand-900 font-bold">8.4m</strong></span>
          <span className="text-sand-300">•</span>
          <span className="text-sand-600">SPD: <strong className="text-sand-900 font-bold">3.8 kn</strong></span>
        </div>

        {/* Center: Map Navigation & Layer Mode Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-sm border border-sand-200 flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => setMapMode('bathymetric')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'bathymetric'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sand-700 hover:text-sand-900 hover:bg-sand-100/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sonar Bathymetric</span>
          </button>
          <button
            onClick={() => setMapMode('gis')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'gis'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sand-700 hover:text-sand-900 hover:bg-sand-100/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vector GIS</span>
          </button>
        </div>

        {/* Right: Expand / Collapse Map Button */}
        {onToggleExpand && (
          <div className="pointer-events-auto">
            <button
              onClick={onToggleExpand}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow-md border border-sky-500 text-xs md:text-sm font-sans font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              title={isExpanded ? "Collapse Map View" : "Expand Map View"}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-4 h-4 text-white" />
                  <span>Collapse Map</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span>Expand Map</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Left-side Map Zoom Control (+ / -) placed at bottom-4 left-3 */}
      <div className="absolute bottom-4 left-3 z-30 flex flex-col gap-1 pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-sand-200 font-mono text-xs">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white hover:bg-sand-100 border border-sand-200 text-sand-900 font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          title="Zoom In (+)"
        >
          <Plus className="w-4 h-4 text-sand-800" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white hover:bg-sand-100 border border-sand-200 text-sand-900 font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          title="Zoom Out (-)"
        >
          <Minus className="w-4 h-4 text-sand-800" />
        </button>
        {mapMode === 'bathymetric' && zoomLevel > 1 && (
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 rounded-lg bg-white hover:bg-sand-100 border border-sand-200 text-sky-700 font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {mapMode === 'bathymetric' ? (
        <div className="relative w-full h-full min-h-[500px] overflow-hidden flex items-center justify-center bg-sand-950">
          <div
            style={{ transform: `scale(${zoomLevel})` }}
            className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          >
            {/* Tactical Bathymetric Map Image */}
            <img
              src="/mock_bathymetric_map.jpg"
              alt="Hydrographic Bathymetric Sonar Map"
              className="w-full h-full object-cover filter contrast-110 brightness-95"
            />

            {/* Interactive Pin Overlays */}
            {validGeolocatedDetections.map((det, index) => {
              const isSelected = det.id === selectedDetectionId;
              const positions = [
                { top: '38%', left: '42%' },
                { top: '25%', left: '56%' },
                { top: '62%', left: '68%' },
                { top: '72%', left: '22%' },
                { top: '48%', left: '78%' },
              ];
              const pos = positions[index % positions.length];

              return (
                <div
                  key={det.id}
                  onClick={() => onSelectDetection && onSelectDetection(det.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
                >
                  {/* Ping Ring Effect */}
                  <div className={`absolute -inset-2 rounded-full ${
                    det.priority === 'high' ? 'bg-red-500/30' : 'bg-emerald-500/30'
                  } animate-ping`} />

                  {/* Main Pin */}
                  <div className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform duration-200 ${
                    isSelected ? 'w-8 h-8 scale-110 ring-4 ring-sky-400/50' : 'w-6 h-6 hover:scale-110'
                  } ${
                    det.priority === 'high' ? 'bg-red-600 text-white' : det.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  {/* Label Badge on Hover or Selection */}
                  <div className={`mt-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-md transition-all border whitespace-nowrap ${
                    isSelected
                      ? 'bg-sand-900 text-amber-300 border-amber-400 opacity-100 scale-100'
                      : 'bg-sand-900/90 text-white border-sand-700 opacity-80 group-hover:opacity-100 scale-95 group-hover:scale-100'
                  }`}>
                    {det.class_name} • {Math.round(det.confidence * 100)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={mapContainerRef}
          style={{ height: '100%', minHeight: '500px' }}
          className="w-full h-full relative z-10"
        />
      )}
    </div>
  );
};

