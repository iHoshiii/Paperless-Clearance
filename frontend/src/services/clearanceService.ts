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
    start_date?: string;
    end_date?: string;
    created_at: string;
}

const clearanceService = {
    // Get active clearance periods (semesters)
    getPeriods: async (): Promise<ClearancePeriod[]> => {
        const { data } = await api.get('/clearances/periods');
        return data;
    },

    // ADMIN: Create a new period
    createPeriod: async (payload: { name: string, start_date?: string, end_date?: string }): Promise<ClearancePeriod> => {
        const response = await api.post('/clearances/periods', payload);
        return response.data;
    },

    // ADMIN: Toggle period active status
    togglePeriod: async (id: string, is_active: boolean): Promise<ClearancePeriod> => {
        const response = await api.put(`/clearances/periods/${id}`, { is_active });
        return response.data;
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
    },

    // GET pending approvals for currently logged in officer
    getPendingApprovals: async (): Promise<any[]> => {
        const response = await api.get('/clearances/pending');
        return response.data;
    },

    // POST update an approval's status
    updateApprovalStatus: async (approvalId: string, status: 'approved' | 'rejected', remarks: string): Promise<any> => {
        const response = await api.post(`/clearances/approve/${approvalId}`, { status, remarks });
        return response.data;
    }
};

export default clearanceService;
