import React, { useState, useEffect } from 'react';
import clearanceService, { ClearanceRequest } from '../../services/clearanceService';
import documentService, { StudentDocument } from '../../services/documentService';

const DocumentManager: React.FC = () => {
    const [requests, setRequests] = useState<ClearanceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<string>('');
    const [documents, setDocuments] = useState<StudentDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await clearanceService.getMyRequests();
            setRequests(data);
            if (data.length > 0 && !selectedRequest) {
                setSelectedRequest(data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async (reqId: string) => {
        if (!reqId) return;
        try {
            const data = await documentService.getDocumentsByRequest(reqId);
            setDocuments(data);
        } catch (err) {
            console.error('Failed to fetch documents');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRequest) {
            fetchDocuments(selectedRequest);
        }
    }, [selectedRequest]);

    const handleSimulatedUpload = async () => {
        if (!selectedRequest) return;

        const fileName = window.prompt('Enter file name (e.g., ID_Clearance.pdf):');
        if (!fileName) return;

        try {
            setUploading(true);
            // In a real app, we would use supabase.storage.from('clearance-docs').upload(...)
            // Here we simulate the metadata registration
            await documentService.registerDocument({
                request_id: selectedRequest,
                name: fileName,
                file_url: `https://placeholder.com/${fileName}`,
                file_type: 'application/pdf'
            });
            fetchDocuments(selectedRequest);
        } catch (err) {
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this document?')) {
            await documentService.deleteDocument(id);
            fetchDocuments(selectedRequest);
        }
    };

    return (
        <div className="document-manager">
            <h3>Document Management</h3>

            <div className="section glass-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>Select Clearance Request</label>
                    <select
                        className="form-control"
                        value={selectedRequest}
                        onChange={(e) => setSelectedRequest(e.target.value)}
                    >
                        {requests.length === 0 && <option>No active requests</option>}
                        {requests.map(req => (
                            <option key={req.id} value={req.id}>
                                {req.period?.name} ({req.status})
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSimulatedUpload}
                    disabled={!selectedRequest || uploading}
                >
                    {uploading ? 'Uploading...' : '+ Upload Document'}
                </button>
            </div>

            <h4>Files for Selected Request</h4>
            <div className="document-list">
                {documents.length === 0 ? (
                    <div className="glass-container" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No documents uploaded for this request yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {documents.map(doc => (
                            <div key={doc.id} className="glass-container" style={{
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ marginRight: '10px' }}>📄</span>
                                    <strong>{doc.name}</strong>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                                        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="btn-text">View</a>
                                    <button onClick={() => handleDelete(doc.id)} className="btn-text delete">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentManager;
