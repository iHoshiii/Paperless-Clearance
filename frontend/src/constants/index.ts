import { UserRole } from '../types/auth';

export const APP_NAME = 'Paperless Clearance';

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
    [UserRole.STUDENT]: 'Student',
    [UserRole.SUB_ORGANIZATION]: 'Sub-Organization',
    [UserRole.MOTHER_ORGANIZATION]: 'Mother Organization',
    [UserRole.ADVISER]: 'Adviser',
    [UserRole.NCSSC]: 'NCSSC',
    [UserRole.CLINIC]: 'Clinic',
    [UserRole.SAS]: 'SAS',
    [UserRole.ADMIN]: 'Administrator'
};

export const ROLE_WELCOME_MESSAGES: Record<UserRole | string, string> = {
    [UserRole.STUDENT]: 'Manage your clearance requests and track progress',
    [UserRole.SUB_ORGANIZATION]: 'Organization Clearance Management & Approvals',
    [UserRole.MOTHER_ORGANIZATION]: 'Monitor and manage department-wide clearances',
    [UserRole.ADVISER]: 'Review and approve student clearance forms',
    [UserRole.NCSSC]: 'Strategic Student Services Oversight',
    [UserRole.CLINIC]: 'Medical Clearance Administration',
    [UserRole.SAS]: 'Student Affairs & Services Portal',
    [UserRole.ADMIN]: 'System-wide configuration and user oversight'
};

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_TOKEN: '/auth/verify',
    CLEARANCE_REQUESTS: '/clearances',
    DOCUMENTS: '/documents'
};

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
};
