import express from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// GET all organizations
// Accessible by any authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET organization stats (approvals counts)
router.get('/stats', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user?.userId;

        // Find the organization the user belongs to
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', userId)
            .single();

        if (userError || !user?.organization_id) {
            return res.status(403).json({ error: 'User is not assigned to an organization' });
        }

        const { data: approvals, error: appError } = await supabase
            .from('clearance_approvals')
            .select('status')
            .eq('organization_id', user.organization_id);

        if (appError) throw appError;

        const stats = {
            total: approvals.length,
            approved: approvals.filter(a => a.status === 'approved').length,
            pending: approvals.filter(a => a.status === 'pending').length,
            rejected: approvals.filter(a => a.status === 'rejected').length
        };

        res.json(stats);
    } catch (error: any) {
        console.error('Error fetching org stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET a single organization
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Organization not found' });
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST create a new organization
// Restricted to ADMIN only
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const { data, error } = await supabase
            .from('organizations')
            .insert({ name, description })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        console.error('Error creating organization:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT update an organization
// Restricted to ADMIN only
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { name, description } = req.body;

        const { data, error } = await supabase
            .from('organizations')
            .update({ name, description })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE an organization
// Restricted to ADMIN only
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { error } = await supabase
            .from('organizations')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Organization deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting organization:', error);
        res.status(500).json({ error: error.message });
    }
});


export default router;
