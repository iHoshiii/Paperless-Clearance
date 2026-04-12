import express from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Submit a New Clearance Request (Student Only)
router.post('/request', authenticateToken, authorizeRoles('STUDENT'), async (req: AuthRequest, res) => {
    try {
        const { period_id } = req.body;
        const student_id = req.user?.userId;

        if (!period_id) {
            return res.status(400).json({ error: 'Clearance period is required' });
        }

        // Check if a request already exists for this period
        const { data: existing } = await supabase
            .from('clearance_requests')
            .select('id')
            .eq('student_id', student_id)
            .eq('period_id', period_id)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'You already have a request for this period' });
        }

        // Create the main request
        const { data: request, error: reqError } = await supabase
            .from('clearance_requests')
            .insert({ student_id, period_id, status: 'pending' })
            .select()
            .single();

        if (reqError) throw reqError;

        // Automatically create approval steps for all organizations
        const { data: organizations } = await supabase.from('organizations').select('id');

        if (organizations && organizations.length > 0) {
            const approvalSteps = organizations.map(org => ({
                request_id: request.id,
                organization_id: org.id,
                status: 'pending'
            }));

            const { error: appError } = await supabase
                .from('clearance_approvals')
                .insert(approvalSteps);

            if (appError) throw appError;
        }

        res.status(201).json({ message: 'Clearance request submitted successfully', request });
    } catch (error: any) {
        console.error('Submission error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Student's Own Requests
router.get('/my-requests', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { data, error } = await supabase
            .from('clearance_requests')
            .select(`
        *,
        period:clearance_periods(name),
        approvals:clearance_approvals(
          id,
          status,
          remarks,
          organization:organizations(name)
        )
      `)
            .eq('student_id', req.user?.userId);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get Pending Approvals (For Organizations/Officers)
router.get('/pending', authenticateToken, async (req: AuthRequest, res) => {
    try {
        // First, find which organization the current user belongs to
        const { data: userData } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', req.user?.userId)
            .single();

        if (!userData?.organization_id) {
            return res.status(403).json({ error: 'User is not assigned to any organization' });
        }

        const { data, error } = await supabase
            .from('clearance_approvals')
            .select(`
        *,
        request:clearance_requests(
          id,
          student:users(first_name, last_name, email, student_id)
        )
      `)
            .eq('organization_id', userData.organization_id)
            .eq('status', 'pending');

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update Approval Status (Approve/Reject)
router.post('/approve/:approvalId', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { status, remarks } = req.body; // status: 'approved' or 'rejected'
        const approverId = req.user?.userId;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { data, error } = await supabase
            .from('clearance_approvals')
            .update({
                status,
                remarks,
                approved_by: approverId,
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.approvalId)
            .select()
            .single();

        if (error) throw error;

        // Logic to check if all steps are now approved to update the main request status
        // ... (This could be a separate helper function)

        res.json({ message: `Clearance ${status} successfully`, data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
