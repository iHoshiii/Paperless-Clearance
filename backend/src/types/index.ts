export type UserRole = 'STUDENT' | 'SUB_ORGANIZATION' | 'MOTHER_ORGANIZATION' | 'ADVISER' | 'NCSSC' | 'CLINIC' | 'SAS' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    student_id?: string;
    department?: string;
    organization_id?: string;
    is_active: boolean;
    created_at: string;
}

export interface Organization {
    id: string;
    name: string;
    description?: string;
    created_at: string;
}

export interface ClearancePeriod {
    id: string;
    name: string;
    is_active: boolean;
    start_date?: string;
    end_date?: string;
    created_at: string;
}

export interface ClearanceRequest {
    id: string;
    student_id: string;
    period_id: string;
    status: 'pending' | 'partially_approved' | 'approved' | 'rejected';
    created_at: string;
    // Joined data
    student?: User;
    period?: ClearancePeriod;
}

export interface ClearanceApproval {
    id: string;
    request_id: string;
    organization_id: string;
    status: 'pending' | 'approved' | 'rejected';
    remarks?: string;
    approved_by?: string;
    updated_at: string;
    // Joined data
    organization?: Organization;
    approver?: User;
}
