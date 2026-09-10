import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import { Survey, SonarImage, Detection, VerificationStatus } from '../types';
import { SonarViewer } from '../components/workspace/SonarViewer';
import { DetectionList } from '../components/workspace/DetectionList';
import { DetectionDetails } from '../components/workspace/DetectionDetails';
import { MapView } from '../components/map/MapView';
import { LoadingState, ErrorState } from '../components/common/Feedback';
import { Map, Layers, FileText, ArrowLeft } from 'lucide-react';

export const AnalysisWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentImage, setCurrentImage] = useState<SonarImage | null>(null);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sonar' | 'map'>('sonar');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSurveyWorkspace = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await surveyService.getSurveyById(id);
      if (!data) {
        setError('Survey not found.');
        return;
      }
      setSurvey(data);

      if (data.images && data.images.length > 0) {
        const firstImg = data.images[0];
        setCurrentImage(firstImg);
        if (firstImg.detections.length > 0) {
          setSelectedDetectionId(firstImg.detections[0].id);
        }
      }
    } catch (err) {
      console.error('Workspace load failed:', err);
      setError('Unable to load survey analysis workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveyWorkspace();
  }, [id]);

  const handleUpdateStatus = async (detectionId: string, status: VerificationStatus, notes?: string) => {
    try {
      const updated = await surveyService.updateDetectionStatus(detectionId, status, notes);
      
      if (currentImage) {
        const updatedDetections = currentImage.detections.map(d => (d.id === detectionId ? updated : d));
        setCurrentImage({
          ...currentImage,
          detections: updatedDetections,
        });
      }
    } catch (err) {
      console.error('Failed to update detection status:', err);
    }
  };

  if (loading) {
    return <LoadingState message="Opening survey workspace..." subtext="Loading high-resolution acoustic sonar channels and AI anomaly metadata" />;
  }

  if (error || !survey || !currentImage) {
    return (
      <ErrorState
        title="Workspace Unavailable"
        message={error || 'Unable to display sonar workspace.'}
        onRetry={loadSurveyWorkspace}
      />
    );
  }

  const selectedDetection = currentImage.detections.find(d => d.id === selectedDetectionId) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-3">
      {/* Workspace Header */}
      <div className="bg-white border border-sand-200 rounded-xl p-3.5 px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/surveys')}
            className="p-1.5 rounded-lg bg-sand-50 border border-sand-200 text-sand-600 hover:text-sand-900 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-sand-900 font-sans tracking-tight">{survey.name}</h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold">
                {currentImage.detections.length} AI Targets
              </span>
            </div>
            <div className="text-[11px] text-sand-600 font-mono flex items-center gap-3 mt-0.5">
              <span>DATE: {survey.date}</span>
              <span>•</span>
              <span>SENSOR: {survey.source || 'Side-Scan Sonar'}</span>
            </div>
          </div>
        </div>

        {/* View Switching & Report Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              onClick={() => setActiveTab('sonar')}
              className={`relative group flex items-center gap-1.5 py-1.5 px-1 font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === 'sonar'
                  ? 'text-sky-600 font-bold'
                  : 'text-sand-600 hover:text-sky-600'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 transition-colors duration-300 ${activeTab === 'sonar' ? 'text-sky-600' : 'text-sand-500 group-hover:text-sky-600'}`} />
              <span>Sonar Canvas</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-sky-600 transition-all duration-300 ease-out ${
                  activeTab === 'sonar' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`relative group flex items-center gap-1.5 py-1.5 px-1 font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === 'map'
                  ? 'text-sky-600 font-bold'
                  : 'text-sand-600 hover:text-sky-600'
              }`}
            >
              <Map className={`w-3.5 h-3.5 transition-colors duration-300 ${activeTab === 'map' ? 'text-sky-600' : 'text-sand-500 group-hover:text-sky-600'}`} />
              <span>Map View</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-sky-600 transition-all duration-300 ease-out ${
                  activeTab === 'map' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </button>
          </div>

          <NavLink
            to="/reports"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white hover:bg-sand-50 text-sand-800 border border-sand-200 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Generate Report</span>
          </NavLink>
        </div>
      </div>

      {/* Main 3-Column Analysis Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Left Column: Filterable Detection List (3 cols) */}
        <div className="lg:col-span-3 h-full min-h-[250px] lg:min-h-0">
          <DetectionList
            detections={currentImage.detections}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={id => setSelectedDetectionId(id)}
          />
        </div>

        {/* Center Column: Sonar Viewer or Map View (6 cols) */}
        <div className="lg:col-span-6 h-full min-h-[400px] lg:min-h-0 flex flex-col">
          {activeTab === 'sonar' ? (
            <SonarViewer
              image={currentImage}
              detections={currentImage.detections}
              selectedDetectionId={selectedDetectionId}
              onSelectDetection={id => setSelectedDetectionId(id)}
            />
          ) : (
            <MapView
              detections={currentImage.detections}
              selectedDetectionId={selectedDetectionId}
              onSelectDetection={id => setSelectedDetectionId(id)}
              height="100%"
            />
          )}
        </div>

        {/* Right Column: Target Inspector & Operator Verification Actions (3 cols) */}
        <div className="lg:col-span-3 h-full min-h-[300px] lg:min-h-0">
          <DetectionDetails
            detection={selectedDetection}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
};
