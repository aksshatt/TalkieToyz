import { ProductSummary } from './product';

export type MilestoneCategory =
  | 'expressive_language'
  | 'receptive_language'
  | 'articulation'
  | 'social_communication'
  | 'fluency'
  | 'voice'
  | 'feeding_swallowing';

export type ProgressLogCategory = MilestoneCategory | 'general_progress';

export interface Milestone {
  id: number;
  title: string;
  description: string;
  category: MilestoneCategory;
  category_display_name: string;
  age_months_min: number;
  age_months_max: number;
  age_range_description: string;
  age_range_years: string;
  position: number;
  indicators: string[];
  tips: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgressLog {
  id: number;
  child_name: string;
  child_age_months: number;
  age_display: string;
  log_date: string;
  category: ProgressLogCategory;
  category_display_name: string;
  notes: string;
  metrics: Record<string, any>;
  achievements: string[];
  milestone?: Milestone;
  product?: ProductSummary;
  created_at: string;
  updated_at: string;
}

export interface ProgressLogFormData {
  child_name: string;
  child_age_months: number;
  log_date: string;
  category: ProgressLogCategory;
  notes?: string;
  metrics?: Record<string, any>;
  achievements?: string[];
  milestone_id?: number;
  product_id?: number;
}

export interface ProgressSummary {
  total_logs: number;
  categories: Record<
    string,
    {
      count: number;
      latest_log: string | null;
    }
  >;
  recent_achievements: Array<{
    date: string;
    category: string;
    achievements: string[];
    notes: string;
  }>;
  progress_timeline: Array<{
    month: string;
    log_count: number;
    categories: Record<string, number>;
  }>;
}

export interface MilestoneFilters {
  category?: MilestoneCategory;
  age?: number;
  min_age?: number;
  max_age?: number;
  q?: string;
  page?: number;
  per_page?: number;
}

export interface ProgressLogFilters {
  child_name?: string;
  category?: ProgressLogCategory;
  start_date?: string;
  end_date?: string;
  q?: string;
  page?: number;
  per_page?: number;
}

export interface MilestonesResponse {
  success: boolean;
  data: Milestone[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface MilestoneResponse {
  success: boolean;
  data: Milestone;
  message: string;
}

export interface ProgressLogsResponse {
  success: boolean;
  data: ProgressLog[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ProgressLogResponse {
  success: boolean;
  data: ProgressLog;
  message: string;
}

export interface ProgressSummaryResponse {
  success: boolean;
  data: ProgressSummary;
  message: string;
}
