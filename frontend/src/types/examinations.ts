export type ExamStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Examination {
  id: string;
  exam_id: string;
  name: string;
  department: string;
  subject: string;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  security_level: 'STANDARD' | 'HIGH' | 'MAXIMUM_TOP_SECRET';
  total_papers?: number;
  assigned_centres_count?: number;
  status: ExamStatus;
  created_at?: string;
}

export interface ExaminationCreateInput {
  exam_id: string;
  name: string;
  department: string;
  subject: string;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  security_level?: 'STANDARD' | 'HIGH' | 'MAXIMUM_TOP_SECRET';
}
