import { Survey, SonarImage, Detection, DashboardStats, VerificationStatus } from '../types';
import { INITIAL_SURVEYS, INITIAL_IMAGES, INITIAL_DETECTIONS, INITIAL_DASHBOARD_STATS } from '../mocks/mockData';
import { generateSonarSampleDataUrl } from '../mocks/sampleImages';

// In-memory store for Demo Mode
let surveys: Survey[] = [...INITIAL_SURVEYS];
let images: SonarImage[] = [...INITIAL_IMAGES];
let detections: Detection[] = [...INITIAL_DETECTIONS];

export const surveyService = {
  // Get overall dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const total_surveys = surveys.length;
    const images_analyzed = images.filter(i => i.status === 'completed').length;
    const total_detections = detections.length;
    const confirmed_detections = detections.filter(d => d.status === 'confirmed').length;
    const high_priority_detections = detections.filter(d => d.priority === 'high').length;
    const pending_review_count = detections.filter(d => d.status === 'ai_detected').length;

    return {
      total_surveys,
      images_analyzed,
      total_detections,
      confirmed_detections,
      high_priority_detections,
      pending_review_count,
    };
  },

  // Get list of all surveys
  getSurveys: async (): Promise<Survey[]> => {
    return [...surveys];
  },

  // Get single survey details
  getSurveyById: async (id: string): Promise<Survey | null> => {
    const survey = surveys.find(s => s.id === id);
    if (!survey) return null;
    
    // Attach current images
    const surveyImages = images.filter(img => img.survey_id === id);
    return {
      ...survey,
      images: surveyImages,
    };
  },

  // Create new survey (matches POST /api/surveys)
  createSurvey: async (data: { name: string; date: string; source?: string }): Promise<Survey> => {
    const newSurvey: Survey = {
      id: `srv_${Date.now().toString().slice(-4)}`,
      name: data.name,
      date: data.date || new Date().toISOString().split('T')[0],
      source: data.source || 'Manual Survey Upload',
      status: 'draft',
      image_count: 0,
      detections_count: 0,
      confirmed_count: 0,
      high_priority_count: 0,
      images: [],
      created_at: new Date().toISOString(),
    };

    surveys = [newSurvey, ...surveys];
    return newSurvey;
  },

  // Upload image to survey (matches POST /api/surveys/{survey_id}/images)
  uploadImage: async (surveyId: string, file: File): Promise<SonarImage> => {
    const objectUrl = URL.createObjectURL(file);
    
    const newImage: SonarImage = {
      id: `img_${Date.now().toString().slice(-4)}`,
      survey_id: surveyId,
      filename: file.name,
      file_size: file.size,
      url: objectUrl,
      dimensions: { width: 1200, height: 800 },
      status: 'uploaded',
      detections: [],
      uploaded_at: new Date().toISOString(),
    };

    images = [newImage, ...images];

    // Update survey stats
    surveys = surveys.map(s => {
      if (s.id === surveyId) {
        return {
          ...s,
          image_count: s.image_count + 1,
          status: 'uploaded' as const,
        };
      }
      return s;
    });

    return newImage;
  },

  // Run AI analysis on image (matches POST /api/images/{image_id}/analyze)
  analyzeImage: async (imageId: string): Promise<{ image: SonarImage; detections: Detection[] }> => {
    const image = images.find(img => img.id === imageId);
    if (!image) throw new Error('Image not found');

    // Update status to analyzing
    image.status = 'analyzing';

    // Simulate AI inference calculation delay (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate realistic AI detections for newly uploaded sonar image
    const newDetections: Detection[] = [
      {
        id: `det_${Date.now()}_1`,
        image_id: imageId,
        survey_id: image.survey_id,
        class_name: 'Derelict Fishing Trap / Ghost Gear',
        confidence: 0.89,
        priority: 'high',
        status: 'ai_detected',
        bbox: { x: 35.0, y: 24.0, width: 8.5, height: 7.2 },
        dimensions: { width: 2.4, height: 1.1 },
        location: { latitude: 18.6415 + (Math.random() * 0.04 - 0.02), longitude: 72.8120 + (Math.random() * 0.04 - 0.02) },
        notes: 'AI auto-detected candidate target.',
        created_at: new Date().toISOString(),
      },
      {
        id: `det_${Date.now()}_2`,
        image_id: imageId,
        survey_id: image.survey_id,
        class_name: 'Artificial Metal Object',
        confidence: 0.76,
        priority: 'medium',
        status: 'ai_detected',
        bbox: { x: 65.0, y: 55.0, width: 7.0, height: 6.0 },
        dimensions: { width: 1.5, height: 1.2 },
        location: { latitude: null, longitude: null }, // Location unavailable test case
        notes: 'High reflectivity anomaly. Location metadata unavailable.',
        created_at: new Date().toISOString(),
      },
    ];

    image.status = 'completed';
    image.detections = newDetections;
    detections = [...newDetections, ...detections];

    // Update parent survey stats
    surveys = surveys.map(s => {
      if (s.id === image.survey_id) {
        const surveyImages = images.filter(i => i.survey_id === s.id);
        const allSurveyDetections = surveyImages.flatMap(i => i.detections);
        return {
          ...s,
          status: 'completed' as const,
          detections_count: allSurveyDetections.length,
          high_priority_count: allSurveyDetections.filter(d => d.priority === 'high').length,
          confirmed_count: allSurveyDetections.filter(d => d.status === 'confirmed').length,
        };
      }
      return s;
    });

    return { image, detections: newDetections };
  },

  // Update detection human review status (Confirm / Reject / Notes)
  updateDetectionStatus: async (
    detectionId: string, 
    status: VerificationStatus, 
    notes?: string
  ): Promise<Detection> => {
    let updatedDetection: Detection | null = null;

    detections = detections.map(d => {
      if (d.id === detectionId) {
        updatedDetection = {
          ...d,
          status,
          notes: notes !== undefined ? notes : d.notes,
        };
        return updatedDetection;
      }
      return d;
    });

    if (!updatedDetection) throw new Error('Detection not found');

    // Also update inside image object
    images = images.map(img => ({
      ...img,
      detections: img.detections.map(d => (d.id === detectionId ? updatedDetection! : d)),
    }));

    // Update survey counters
    surveys = surveys.map(s => {
      const surveyImages = images.filter(i => i.survey_id === s.id);
      const allDets = surveyImages.flatMap(i => i.detections);
      return {
        ...s,
        confirmed_count: allDets.filter(d => d.status === 'confirmed').length,
      };
    });

    return updatedDetection;
  },

  // Get all detections (with filter support)
  getAllDetections: async (): Promise<Detection[]> => {
    return [...detections];
  },
};
