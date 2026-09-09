import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { UploadDropzone } from '../components/upload/UploadDropzone';
import { 
  Compass, 
  Sparkles, 
  ArrowLeft, 
  Radar, 
  Sliders, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Layers, 
  FileCheck2, 
  Trash2, 
  Save, 
  Radio
} from 'lucide-react';

export const NewSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [surveyName, setSurveyName] = useState<string>('Baltic Basin Sector 14-East');
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transducer, setTransducer] = useState<string>('EdgeTech 4205 Tri-Frequency (455 / 900 kHz)');
  const [altitude, setAltitude] = useState<string>('14.5 m');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const stagedFiles = [
    { name: 'SSS_Kattegat_Line03_Ch1.png', size: '42.4 MB', channel: '455 kHz Port Swath · Waterfall 2048px', coords: '57°14\'22"N 11°32\'48"E' },
    { name: 'SSS_Kattegat_Line03_Ch2.png', size: '41.8 MB', channel: '455 kHz Starboard Swath · Waterfall 2048px', coords: '57°14\'35"N 11°33\'10"E' },
    { name: 'SSS_Kattegat_Line04_Raw.jpg', size: '38.1 MB', channel: 'Dual Channel Mosaic Strip · 900 kHz Detail', coords: '57°15\'01"N 11°33\'45"E' },
  ];

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    if (!surveyName || surveyName === 'Baltic Basin Sector 14-East') {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setSurveyName(`Survey Pass: ${cleanName}`);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyName) return;

    try {
      setIsUploading(true);
      setUploadProgress(25);

      const newSurvey = await surveyService.createSurvey({
        name: surveyName,
        date: surveyDate,
        source: `${transducer} | Alt: ${altitude}`,
      });
      setUploadProgress(65);

      let uploadedImageId = '';
      if (selectedFile) {
        const uploadedImage = await surveyService.uploadImage(newSurvey.id, selectedFile);
        uploadedImageId = uploadedImage.id;
      }
      setUploadProgress(100);
      setIsUploading(false);

      setIsAnalyzing(true);
      setAnalysisStep('Preparing side-scan sonar waterfall data...');
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep('Enhancing contrast & filtering acoustic reverberation noise...');
      await new Promise(r => setTimeout(r, 600));

      setAnalysisStep('Running AI model inference for candidate anomaly detection...');
      if (uploadedImageId) {
        await surveyService.analyzeImage(uploadedImageId);
      }

      setAnalysisStep('Scoring candidate priorities & preparing workspace...');
      await new Promise(r => setTimeout(r, 400));

      navigate(`/surveys/${newSurvey.id}`);
    } catch (err) {
      console.error('Analysis failed:', err);
      setIsUploading(false);
      setIsAnalyzing(false);
      alert('Failed to process sonar survey image. Please check file format and retry.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span className="font-mono text-xs text-sky-700 uppercase font-semibold">Acoustic Ingestion Protocol</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-sand-900 font-sans tracking-tight">New Survey</h1>
          <p className="text-xs md:text-sm text-sand-600 mt-1 max-w-2xl">
            Upload high-frequency side-scan sonar waterfall imagery for AI-assisted seafloor anomaly classification, dimensional shadow measurement, and geo-localization.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-sand-100 rounded-lg text-xs font-mono border border-sand-200">
          <Activity className="w-4 h-4 text-sky-600" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-sand-500 uppercase font-semibold">Detection Pipeline</span>
            <span className="font-bold text-sand-900">Model Ver. 4.2-HydroActive</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleStartAnalysis} className="space-y-6">
        {/* Survey Specification & Acoustic Metadata */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-sand-200 space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-sand-600 font-semibold">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>SURVEY SPECIFICATION & ACOUSTIC METADATA</span>
            </div>
            <span className="font-mono text-xs text-sand-500">Grid Reference WGS-84</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-sand-700 font-semibold block">Survey Designation</label>
              <input
                type="text"
                required
                value={surveyName}
                onChange={e => setSurveyName(e.target.value)}
                placeholder="e.g. Baltic Basin Sector 14-East"
                className="w-full bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 text-sand-900 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sand-700 font-semibold block">Acquisition Date</label>
              <input
                type="date"
                value={surveyDate}
                onChange={e => setSurveyDate(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 text-sand-900 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sand-700 font-semibold block">Acoustic Transducer</label>
              <select
                value={transducer}
                onChange={e => setTransducer(e.target.value)}
                className="w-full bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 text-sand-900 focus:outline-none focus:border-sky-500 font-semibold cursor-pointer"
              >
                <option>EdgeTech 4205 Tri-Frequency (455 / 900 kHz)</option>
                <option>Klein Marine 3000 (455 / 900 kHz)</option>
                <option>DeepVision DE3468D High-Res</option>
                <option>Kongsberg GeoPulse Compact</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sand-700 font-semibold block">Towfish Seafloor Altitude</label>
              <input
                type="text"
                value={altitude}
                onChange={e => setAltitude(e.target.value)}
                placeholder="e.g. 14.5 m"
                className="w-full bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 text-sand-900 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Upload Dropzone Section with Nadir track indicator */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-sand-200 space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <span className="font-mono text-xs text-sand-600 font-semibold">
              DROP SIDE-SCAN SONAR IMAGERY HERE
            </span>
            <span className="font-mono text-[11px] text-sand-500">Supports PNG, JPG, GeoTIFF up to 150MB</span>
          </div>

          <UploadDropzone
            onFileSelected={handleFileSelected}
            onRemoveFile={handleRemoveFile}
            selectedFile={selectedFile}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>

        {/* Staged Telemetry Strips Table */}
        <div className="bg-white rounded-xl shadow-xs border border-sand-200 p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sand-900 font-sans text-sm">Staged Telemetry Strips</h3>
              <span className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-700 text-[10px] font-bold border border-sand-200">
                {stagedFiles.length + (selectedFile ? 1 : 0)} Files
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Slant-Range Corrected</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-50 text-sand-500 uppercase text-[10px] border-b border-sand-200 font-semibold">
                  <th className="py-2.5 px-3">Acoustic File / Identification</th>
                  <th className="py-2.5 px-3">Payload Size</th>
                  <th className="py-2.5 px-3">Embedded Coordinate Swath</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-150 text-xs">
                {selectedFile && (
                  <tr className="hover:bg-sand-50/70 transition-colors bg-sky-50/30">
                    <td className="py-3 px-3">
                      <div className="font-bold text-sky-800">{selectedFile.name}</div>
                      <div className="text-[10px] text-sand-500">Newly Uploaded Strip</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-sand-900">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </td>
                    <td className="py-3 px-3 text-sand-700">58°12'45"N 019°45'18"E</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Ready
                      </span>
                    </td>
                  </tr>
                )}
                {stagedFiles.map((stg, i) => (
                  <tr key={i} className="hover:bg-sand-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-sand-900">{stg.name}</div>
                      <div className="text-[10px] text-sand-500">{stg.channel}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-sand-900">{stg.size}</td>
                    <td className="py-3 px-3 text-sand-700">{stg.coords}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Status Progress Container */}
        {isAnalyzing && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 text-center space-y-3 shadow-md font-mono">
            <Radar className="w-10 h-10 text-sky-600 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-sand-900">AI Acoustic Inference Running</h4>
            <p className="text-xs text-sky-800 font-semibold animate-pulse">{analysisStep}</p>
          </div>
        )}

        {/* Summary & Submit Action Bar */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-sand-200 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-4 text-sand-700">
            <span className="font-bold text-sand-900">
              {stagedFiles.length + (selectedFile ? 1 : 0)} Sonar Images Staged
            </span>
            <span>Payload: <strong className="text-sand-900">122.3 MB</strong></span>
            <span>Est. Inference: <strong className="text-sand-900">~45 sec</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/surveys')}
              className="px-4 py-2 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 font-semibold border border-sand-200 transition-colors"
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={isUploading || isAnalyzing}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-sans text-xs font-semibold transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Survey...' : 'Analyze Survey'}</span>
            </button>
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-sand-200 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-700 font-mono text-xs font-bold uppercase">
              <Radio className="w-4 h-4 text-sky-600" />
              <span>Automatic Feature Extraction</span>
            </div>
            <p className="text-xs text-sand-600 font-sans leading-relaxed">
              Model targets anthropogenic debris, cable unburials, boulders, and seabed scour troughs using paired shadow-casting geometry.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-sand-200 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-700 font-mono text-xs font-bold uppercase">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Slant-Range Correction</span>
            </div>
            <p className="text-xs text-sand-600 font-sans leading-relaxed">
              Raw acoustic travel times are mapped to true horizontal distance from towfish path using real-time altimetry calculation.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-sand-200 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-700 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>IHO S-44 Compliance</span>
            </div>
            <p className="text-xs text-sand-600 font-sans leading-relaxed">
              All anomaly positions preserve full coordinate precision and are exportable directly to ESRI Shapefile and Caris formats.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
