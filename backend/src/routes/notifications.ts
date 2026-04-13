import express from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET all notifications for the current user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PUT mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Notification marked as read' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a notification
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Notification deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
