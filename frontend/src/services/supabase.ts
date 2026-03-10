import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  student_id?: string;
  department?: string;
  contact_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClearanceRequest {
  id: string;
  student_id: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  academic_year: string;
  semester: string;
  created_at: string;
  updated_at: string;
}

export interface ClearanceApproval {
  id: string;
  clearance_request_id: string;
  approver_role: string;
  approver_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  notes?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  clearance_request_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}
