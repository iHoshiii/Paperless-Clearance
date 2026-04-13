import express from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();


// 0. Get Clearance Periods
router.get('/periods', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const query = supabase.from('clearance_periods').select('*');

        // Non-admins only see active periods
        if (req.user?.role !== 'admin') {
            query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 0.1 Create a Period (Admin Only)
router.post('/periods', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, start_date, end_date } = req.body;
        const { data, error } = await supabase
            .from('clearance_periods')
            .insert({ name, start_date, end_date, is_active: true })
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 0.2 Update/Toggle a Period (Admin Only)
router.put('/periods/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { is_active, name } = req.body;
        const { data, error } = await supabase
            .from('clearance_periods')
            .update({ is_active, name })
            .eq('id', req.params.id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 1. Submit a New Clearance Request (Student Only)
router.post('/request', authenticateToken, authorizeRoles('STUDENT'), async (req: AuthRequest, res) => {
    try {
        const { period_id } = req.body;
        const student_id = req.user?.userId;

        if (!period_id) {
            return res.status(400).json({ error: 'Clearance period is required' });
        }

        // Fetch student's department to determine specific requirements
        const { data: student } = await supabase
            .from('users')
            .select('department_id')
            .eq('id', student_id)
            .single();

        // Check for existing request
        const { data: existing } = await supabase
            .from('clearance_requests')
            .select('id')
            .eq('student_id', student_id)
            .eq('period_id', period_id)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'You already have a request for this period' });
        }

        // Create main request
        const { data: request, error: reqError } = await supabase
            .from('clearance_requests')
            .insert({ student_id, period_id, status: 'pending' })
            .select()
            .single();

        if (reqError) throw reqError;

        // Fetch requirements based on student's department or general requirements
        // If student has no department, only look for department_id is null
        const reqQuery = supabase.from('clearance_requirements').select('organization_id');
        if (student?.department_id) {
            reqQuery.or(`department_id.eq.${student.department_id},department_id.is.null`);
        } else {
            reqQuery.is('department_id', null);
        }

        const { data: requirements } = await reqQuery;

        // Fallback: If no requirements are defined, use all organizations
        let orgIds: string[] = [];
        if (requirements && requirements.length > 0) {
            orgIds = requirements.map(r => r.organization_id);
        } else {
            const { data: allOrgs } = await supabase.from('organizations').select('id');
            orgIds = allOrgs?.map(o => o.id) || [];
        }

        if (orgIds.length > 0) {
            const approvalSteps = orgIds.map(orgId => ({
                request_id: request.id,
                organization_id: orgId,
                status: 'pending'
            }));

            const { error: appError } = await supabase
                .from('clearance_approvals')
                .insert(approvalSteps);

            if (appError) throw appError;
        }

        // Create a notification for the student
        await supabase.from('notifications').insert({
            user_id: student_id,
            title: 'Clearance Requested',
            message: 'Your clearance request has been submitted and is pending approvals.',
            type: 'INFO'
        });

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
            .select(`
                *,
                organization:organizations(name),
                request:clearance_requests(student_id)
            `)
            .single();

        if (error) throw error;

        // Send notification to the student
        await supabase.from('notifications').insert({
            user_id: data.request.student_id,
            title: `Clearance Update: ${data.organization.name}`,
            message: `Your clearance request was ${status} by ${data.organization.name}.${remarks ? ' Remarks: ' + remarks : ''}`,
            type: status === 'approved' ? 'APPROVAL' : 'REJECTION'
        });

        // Log to Audit Trail
        await supabase.from('audit_logs').insert({
            user_id: approverId,
            action: `ORG_${status.toUpperCase()}`,
            entity_type: 'CLEARANCE_APPROVAL',
            entity_id: data.id,
            details: { status, remarks, org_name: data.organization.name }
        });

        // Automatically update the main request status
        await checkAndUpdateRequestStatus(data.request_id);

        res.json({ message: `Clearance ${status} successfully`, data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Helper to update the main clearance_request status based on its individual approvals
 */
async function checkAndUpdateRequestStatus(requestId: string) {
    try {
        const { data: approvals, error } = await supabase
            .from('clearance_approvals')
            .select('status')
            .eq('request_id', requestId);

        if (error) throw error;

        let newStatus: 'pending' | 'partially_approved' | 'approved' | 'rejected' = 'pending';

        const total = approvals.length;
        const approvedCount = approvals.filter(a => a.status === 'approved').length;
        const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

        if (rejectedCount > 0) {
            newStatus = 'rejected'; // If one rejects, usually the whole thing is stuck/rejected
        } else if (approvedCount === total && total > 0) {
            newStatus = 'approved';
        } else if (approvedCount > 0) {
            newStatus = 'partially_approved';
        }

        await supabase
            .from('clearance_requests')
            .update({ status: newStatus })
            .eq('id', requestId);

    } catch (err) {
        console.error('Failed to update overall status:', err);
    }
}

export default router;
