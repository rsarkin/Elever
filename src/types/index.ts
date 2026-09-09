export type PriorityLevel = 'high' | 'medium' | 'low';

export type VerificationStatus = 'ai_detected' | 'confirmed' | 'rejected';

export interface BoundingBox {
  x: number; // percentage (0-100) or pixel value relative to image width
  y: number; // percentage (0-100) or pixel value relative to image height
  width: number;
  height: number;
}

export interface EstimatedDimensions {
  width: number | null; // in meters if available
  height: number | null;
}

export interface GeographicLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface Detection {
  id: string;
  image_id: string;
  survey_id: string;
  class_name: string; // e.g., 'fishing_gear', 'artificial_object', 'shipwreck', 'other_anomaly'
  confidence: number; // 0.0 - 1.0
  priority: PriorityLevel;
  status: VerificationStatus;
  bbox: BoundingBox;
  dimensions?: EstimatedDimensions | null;
  location?: GeographicLocation | null;
  notes?: string;
  thumbnail?: string;
  created_at: string;
}

export interface SonarImage {
  id: string;
  survey_id: string;
  filename: string;
  file_size?: number;
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  status: 'uploaded' | 'analyzing' | 'completed' | 'error';
  detections: Detection[];
  uploaded_at: string;
}

export interface Survey {
  id: string;
  name: string;
  date: string;
  source?: string;
  status: 'draft' | 'uploaded' | 'analyzing' | 'completed';
  image_count: number;
  detections_count: number;
  confirmed_count: number;
  high_priority_count: number;
  images?: SonarImage[];
  created_at: string;
}

export interface DashboardStats {
  total_surveys: number;
  images_analyzed: number;
  total_detections: number;
  confirmed_detections: number;
  high_priority_detections: number;
  pending_review_count: number;
}

export interface DetectionFilter {
  class_name?: string;
  priority?: PriorityLevel | 'all';
  status?: VerificationStatus | 'all';
  searchQuery?: string;
}
