import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('CRITICAL ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
