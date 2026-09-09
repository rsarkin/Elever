import React, { useEffect, useRef } from 'react';
import { Detection } from '../../types';
import L from 'leaflet';
import { AlertCircle, Compass } from 'lucide-react';

interface MapViewProps {
  detections: Detection[];
  selectedDetectionId?: string | null;
  onSelectDetection?: (id: string) => void;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  detections,
  selectedDetectionId,
  onSelectDetection,
  height = '400px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const validGeolocatedDetections = detections.filter(
    d => d.location && d.location.latitude != null && d.location.longitude != null
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = validGeolocatedDetections.length > 0
        ? [validGeolocatedDetections[0].location!.latitude!, validGeolocatedDetections[0].location!.longitude!]
        : [18.5204, 73.8567];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      // Use CartoDB Positron / Voyager clean light map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

      let iconColor = '#0284C7'; // suitable marine blue
      if (det.priority === 'high') iconColor = '#DC2626'; // red
      else if (det.priority === 'medium') iconColor = '#D97706'; // amber
      else if (det.priority === 'low') iconColor = '#16A34A'; // pastel green

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
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
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
  }, [detections, selectedDetectionId]);

  return (
    <div className="bg-white border border-sand-200 rounded-xl overflow-hidden shadow-xs relative flex flex-col">
      <div className="h-10 bg-sand-50/80 border-b border-sand-200 px-4 flex items-center justify-between text-xs font-mono text-sand-800 font-semibold">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-600" />
          <span>GEOSPATIAL ANOMALY MAP</span>
        </div>
        <span className="text-[11px] text-sand-600 font-medium">
          {validGeolocatedDetections.length} Geolocated Target(s)
        </span>
      </div>

      {validGeolocatedDetections.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center text-center bg-sand-50/40 min-h-[300px]">
          <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
          <h4 className="text-sm font-bold text-sand-900">Location Unavailable</h4>
          <p className="text-xs text-sand-600 max-w-sm mt-1">
            No valid GPS metadata exists in the header of the selected survey images. Coordinates will appear here when telemetry is present.
          </p>
        </div>
      ) : (
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full relative z-10"
        />
      )}
    </div>
  );
};
