export enum UserRole {
  STUDENT = 'student',
  SUB_ORGANIZATION = 'sub_organization',
  MOTHER_ORGANIZATION = 'mother_organization',
  ADVISER = 'adviser',
  NCSSC = 'ncssc',
  CLINIC = 'clinic',
  SAS = 'sas',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  student_id?: string;
  department?: string;
  contact_number?: string;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
