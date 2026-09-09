import React, { useState, useRef } from 'react';
import { Detection, SonarImage } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crosshair, 
  Hand, 
  Ruler, 
  Sliders, 
  Compass, 
  Layers, 
  Activity,
  Navigation
} from 'lucide-react';

interface SonarViewerProps {
  image: SonarImage;
  detections: Detection[];
  selectedDetectionId: string | null;
  onSelectDetection: (id: string) => void;
}

export const SonarViewer: React.FC<SonarViewerProps> = ({
  image,
  detections,
  selectedDetectionId,
  onSelectDetection,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showAllLabels, setShowAllLabels] = useState<boolean>(true);
  const [contrastGain, setContrastGain] = useState<number>(65);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<'pan' | 'caliper' | 'select'>('select');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="flex flex-col h-full bg-white border border-sand-200 rounded-xl overflow-hidden shadow-sm relative">
      {/* Top Floating Control Bar Overlay inside Viewer */}
      <div className="h-11 bg-sand-50/95 border-b border-sand-200 px-4 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-sand-800 font-mono">
            <Crosshair className="w-4 h-4 text-sky-600" />
            <span className="truncate max-w-[180px] sm:max-w-xs font-bold">{image.filename}</span>
          </div>
          <span className="text-xs text-sand-400 font-mono">|</span>
          <span className="text-[11px] text-sky-800 font-mono font-semibold px-2 py-0.5 bg-sky-50 rounded border border-sky-200">
            {detections.length} AI Target(s)
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 font-mono">
          <button
            onClick={() => setShowAllLabels(!showAllLabels)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
              showAllLabels
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                : 'bg-white border-sand-200 text-sand-600'
            }`}
          >
            {showAllLabels ? 'Labels: ON' : 'Labels: OFF'}
          </button>
          
          <div className="h-4 w-px bg-sand-200 mx-1" />

          {/* Tool selectors */}
          <button
            onClick={() => setActiveTool(activeTool === 'pan' ? 'select' : 'pan')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'pan' ? 'bg-sky-100 text-sky-800 font-bold border border-sky-300' : 'text-sand-600 hover:bg-sand-100'
            }`}
            title="Pan Hand Tool"
          >
            <Hand className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'caliper' ? 'select' : 'caliper')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'caliper' ? 'bg-sky-100 text-sky-800 font-bold border border-sky-300' : 'text-sand-600 hover:bg-sand-100'
            }`}
            title="Measurement Calipers"
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsInverted(!isInverted)}
            className={`p-1.5 rounded transition-colors ${
              isInverted ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300' : 'text-sand-600 hover:bg-sand-100'
            }`}
            title="Invert Colormap"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-sand-200 mx-1" />

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-sand-100 text-sand-600 hover:text-sand-900 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-sand-700 w-10 text-center font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-sand-100 text-sand-600 hover:text-sand-900 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Fit to View"
            className="p-1.5 rounded hover:bg-sand-100 text-sand-600 hover:text-sand-900 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Contrast Slider */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-sand-200">
            <span className="text-[10px] text-sand-500 font-semibold">Contrast</span>
            <input
              type="range"
              min="20"
              max="100"
              value={contrastGain}
              onChange={e => setContrastGain(Number(e.target.value))}
              className="w-16 h-1 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>
        </div>
      </div>

      {/* Main Sonar Viewport Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-sand-900 flex items-center justify-center p-4 min-h-[440px] select-none"
      >
        {/* Stream Status Ribbon (Top Left) */}
        <div className="absolute top-3 left-3 bg-sand-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-xs flex items-center gap-2 z-20 border border-sand-700 font-mono text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="uppercase font-semibold tracking-wider">Acoustic Waterfall · Live Buffer (1,480 / 1,480 pings)</span>
        </div>

        {/* Port & Starboard Range Scale Tick Marks */}
        <div className="absolute top-0 bottom-0 left-0 w-8 flex flex-col justify-between py-6 px-1 pointer-events-none bg-sand-900/40 backdrop-blur-xs font-mono text-[10px] text-sand-300 z-10">
          <span>-50m</span>
          <span>-40m</span>
          <span>-30m</span>
          <span>-20m</span>
          <span>-10m</span>
          <span className="text-sky-400 font-bold">Port</span>
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-8 flex flex-col justify-between py-6 px-1 pointer-events-none bg-sand-900/40 backdrop-blur-xs font-mono text-[10px] text-sand-300 text-right z-10">
          <span>+50m</span>
          <span>+40m</span>
          <span>+30m</span>
          <span>+20m</span>
          <span>+10m</span>
          <span className="text-sky-400 font-bold">Stbd</span>
        </div>

        {/* Central Nadir Blind Zone Line Overlay */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-black/40 pointer-events-none flex flex-col justify-between items-center py-4 z-10 border-x border-sky-500/20">
          <span className="font-mono text-[9px] text-sand-200 bg-sand-900/80 px-1 rounded uppercase tracking-widest">
            Towfish Track
          </span>
          <span className="font-mono text-[9px] text-sand-200 bg-sand-900/80 px-1 rounded uppercase tracking-widest">
            Nadir 0m
          </span>
        </div>

        {/* Sonar Canvas Container */}
        <div 
          className="relative transition-transform duration-200 ease-out shadow-2xl rounded border border-sand-700"
          style={{ 
            transform: `scale(${zoomLevel})`,
            filter: `contrast(${contrastGain + 40}%) ${isInverted ? 'invert(1)' : ''}`
          }}
        >
          {/* Main Sonar Image */}
          <img
            src={image.url}
            alt={image.filename}
            className="max-w-full h-auto block rounded filter contrast-125 sepia brightness-95 opacity-95"
            draggable={false}
          />

          {/* AI Bounding Boxes Overlays */}
          {detections.map(det => {
            const isSelected = det.id === selectedDetectionId;

            let borderColor = 'border-sky-500';
            let bgGlow = 'bg-sky-500/10';
            if (det.priority === 'high') {
              borderColor = 'border-amber-400';
              bgGlow = 'bg-amber-500/15';
            } else if (det.priority === 'medium') {
              borderColor = 'border-sky-400';
              bgGlow = 'bg-sky-500/15';
            } else if (det.priority === 'low') {
              borderColor = 'border-emerald-400';
              bgGlow = 'bg-emerald-500/15';
            }

            if (det.status === 'confirmed') {
              borderColor = 'border-emerald-400';
              bgGlow = 'bg-emerald-500/20';
            } else if (det.status === 'rejected') {
              borderColor = 'border-rose-400';
              bgGlow = 'bg-rose-500/20';
            }

            return (
              <div
                key={det.id}
                onClick={() => onSelectDetection(det.id)}
                className={`absolute cursor-pointer transition-all duration-150 border-2 rounded ${borderColor} ${bgGlow} ${
                  isSelected ? 'ring-4 ring-sky-400/60 z-30 shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:z-20'
                }`}
                style={{
                  left: `${det.bbox.x}%`,
                  top: `${det.bbox.y}%`,
                  width: `${det.bbox.width}%`,
                  height: `${det.bbox.height}%`,
                }}
              >
                {/* Precision Corner Reticles */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-sky-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-sky-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-sky-400" />

                {/* Target Label Overlay */}
                {(showAllLabels || isSelected) && (
                  <div className="absolute -top-7 left-0 flex items-center gap-1.5 bg-sand-900/95 border border-sand-600 px-2 py-0.5 rounded text-[11px] font-mono text-white font-bold whitespace-nowrap shadow-md z-30">
                    <span className="text-amber-300">{det.class_name}</span>
                    <span className="text-sand-400">|</span>
                    <span className="text-emerald-400">{Math.round(det.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Real-time Hydrological Cursor Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-sand-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-3 font-mono text-[11px] text-white border border-sand-700 z-20">
          <div className="flex items-center gap-1 text-sky-400">
            <Navigation className="w-3.5 h-3.5" />
            <span className="font-bold">58°12.441'N 019°45.120'E</span>
          </div>
          <span className="w-px h-3 bg-sand-700" />
          <div className="flex items-center gap-1 text-sand-300">
            <span>Seabed Depth:</span>
            <span className="text-white font-bold">48.2m</span>
          </div>
          <span className="w-px h-3 bg-sand-700" />
          <div className="flex items-center gap-1 text-sand-300">
            <span>Slant Range:</span>
            <span className="text-white font-bold">32m Port</span>
          </div>
          <span className="w-px h-3 bg-sand-700" />
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Speed: 3.4 kn</span>
          </div>
        </div>
      </div>

      {/* Time-Varying Gain (TVG) Acoustic Waveform Strip Under Viewer */}
      <div className="h-10 bg-sand-50 border-t border-sand-200 px-4 flex items-center justify-between font-mono text-[11px] text-sand-700">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sand-900 uppercase">TVG Gain Profile:</span>
          {/* Inline Waveform SVG */}
          <svg className="h-5 w-48 text-sky-600" fill="none" viewBox="0 0 200 24">
            <path d="M0 12 Q 25 3, 50 12 T 100 12 T 150 7 T 200 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 12 Q 25 18, 50 12 T 100 12 T 150 17 T 200 12" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex items-center gap-4">
          <div>Frequency: <span className="font-bold text-sand-900">410 kHz Chirp</span></div>
          <div>Ping Rate: <span className="font-bold text-sand-900">12 Hz</span></div>
          <div>Swath Width: <span className="font-bold text-sand-900">150m Total</span></div>
        </div>
      </div>
    </div>
  );
};
