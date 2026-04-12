import api from './api';

export interface Organization {
    id: string;
    name: string;
    description?: string;
    created_at: string;
}

const organizationService = {
    getAll: async (): Promise<Organization[]> => {
        const response = await api.get('/organizations');
        return response.data;
    },

    getById: async (id: string): Promise<Organization> => {
        const response = await api.get(`/organizations/${id}`);
        return response.data;
    },

    create: async (data: { name: string; description?: string }): Promise<Organization> => {
        const response = await api.post('/organizations', data);
        return response.data;
    },

    update: async (id: string, data: { name: string; description?: string }): Promise<Organization> => {
        const response = await api.put(`/organizations/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/organizations/${id}`);
    }
};

export default organizationService;
