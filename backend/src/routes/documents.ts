import express from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 1. Upload/Register a document
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const { request_id, name, file_url, file_type } = req.body;

        if (!request_id || !name || !file_url) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('documents')
            .insert({
                request_id,
                name,
                file_url,
                file_type,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get documents for a specific request
router.get('/request/:requestId', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('request_id', req.params.requestId);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Delete a document
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Document deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
