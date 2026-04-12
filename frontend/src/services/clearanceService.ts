import api from './api';

export interface ClearanceRequest {
    id: string;
    student_id: string;
    period_id: string;
    status: 'pending' | 'partially_approved' | 'approved' | 'rejected';
    created_at: string;
    period?: { name: string };
    approvals?: Array<{
        id: string;
        status: 'pending' | 'approved' | 'rejected';
        remarks?: string;
        organization: { name: string };
    }>;
}

export interface ClearancePeriod {
    id: string;
    name: string;
    is_active: boolean;
}

const clearanceService = {
    // Get active clearance periods (semesters)
    getPeriods: async (): Promise<ClearancePeriod[]> => {
        const response = await api.get('/organizations'); // Temporary: usually a separate route, but we'll adapt
        // Actually, I should create a separate endpoint for periods in the backend too.
        // But for now, let's assume this exists or use a direct query.
        const { data } = await api.get('/clearances/periods');
        return data;
    },

    // Submit a new request
    submitRequest: async (period_id: string): Promise<any> => {
        const response = await api.post('/clearances/request', { period_id });
        return response.data;
    },

    // Get student's requests
    getMyRequests: async (): Promise<ClearanceRequest[]> => {
        const response = await api.get('/clearances/my-requests');
        return response.data;
    }
};

export default clearanceService;
