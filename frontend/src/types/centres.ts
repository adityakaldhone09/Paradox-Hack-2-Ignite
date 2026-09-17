export interface Centre {
  id: string;
  centre_id: string;
  name: string;
  city: string;
  state: string;
  code: string;
  is_authorized: boolean;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
  authorized_devices_count?: number;
  assigned_exams_count?: number;
  created_at?: string;
}

export interface CentreCreateInput {
  centre_id: string;
  name: string;
  city: string;
  state: string;
  code: string;
}
