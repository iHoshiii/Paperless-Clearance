import api from './api';

export interface StudentDocument {
    id: string;
    request_id: string;
    name: string;
    file_url: string;
    file_type: string;
    status: string;
    created_at: string;
}

const documentService = {
    // Register a document in the database (assuming it's already uploaded to Supabase Storage)
    registerDocument: async (payload: { request_id: string, name: string, file_url: string, file_type: string }): Promise<StudentDocument> => {
        const response = await api.post('/documents', payload);
        return response.data;
    },

    // Get documents for a request
    getDocumentsByRequest: async (requestId: string): Promise<StudentDocument[]> => {
        const response = await api.get(`/documents/request/${requestId}`);
        return response.data;
    },

    // Delete a document
    deleteDocument: async (id: string): Promise<any> => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    }
};

export default documentService;
