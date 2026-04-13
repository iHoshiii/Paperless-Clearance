import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';

const DEFAULT_PASSWORD = 'password123';

async function seedAll() {
    console.log('====================================');
    console.log('  PAPERLESS CLEARANCE - SEEDER');
    console.log('====================================');

    try {
        const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
        console.log(`\nUsing password: "${DEFAULT_PASSWORD}" for all accounts.\n`);

        // ── 1. Get organizations from DB ──────────────────────────────
        const { data: orgs, error: orgError } = await supabase
            .from('organizations')
            .select('id, name, code');

        if (orgError || !orgs || orgs.length === 0) {
            console.error('No organizations found. Make sure you ran the SQL schema first!');
            process.exit(1);
        }

        console.log(`Found ${orgs.length} organizations.\n`);

        // ── 2. Define all seed accounts ───────────────────────────────
        const accounts = [
            // Admin
            {
                email: 'admin@test.com',
                first_name: 'System',
                last_name: 'Administrator',
                role: 'admin',
                organization_id: null,
                student_id: null,
            },
            // Mother Organization
            {
                email: 'motherorg@test.com',
                first_name: 'Mother',
                last_name: 'Organization',
                role: 'mother_organization',
                organization_id: null,
                student_id: null,
            },
            // Student
            {
                email: 'student@test.com',
                first_name: 'Juan',
                last_name: 'dela Cruz',
                role: 'student',
                organization_id: null,
                student_id: '2024-00001',
            },
            // Clinic Officer → role: 'clinic'
            ...orgs.filter(o => o.code === 'CLINIC').map(org => ({
                email: `officer.clinic@test.com`,
                first_name: 'Clinic',
                last_name: 'Officer',
                role: 'clinic',
                organization_id: org.id,
                student_id: null,
            })),
            // SAS Officer → role: 'sas'
            ...orgs.filter(o => o.code === 'SAS').map(org => ({
                email: `officer.sas@test.com`,
                first_name: 'SAS',
                last_name: 'Officer',
                role: 'sas',
                organization_id: org.id,
                student_id: null,
            })),
            // All other orgs → role: 'sub_organization'
            ...orgs.filter(o => !['CLINIC', 'SAS'].includes(o.code || '')).map(org => ({
                email: `officer.${org.code?.toLowerCase()}@test.com`,
                first_name: org.name,
                last_name: 'Officer',
                role: 'sub_organization',
                organization_id: org.id,
                student_id: null,
            })),
        ];

        // ── 3. Delete and re-insert all accounts ──────────────────────
        const emails = accounts.map(a => a.email);
        await supabase.from('users').delete().in('email', emails);
        console.log('Cleaned up old test accounts...');

        const { error: insertError } = await supabase.from('users').insert(
            accounts.map(a => ({
                ...a,
                password_hash: hash,
                is_active: true,
            }))
        );

        if (insertError) throw insertError;

        // ── 4. Print summary ──────────────────────────────────────────
        console.log('\n✅ All accounts created!\n');
        console.log('┌─────────────────────────────────────────────────────────────┐');
        console.log('│  Role           │  Email                      │  Password   │');
        console.log('├─────────────────────────────────────────────────────────────┤');
        accounts.forEach(a => {
            const role = a.role.padEnd(14);
            const email = a.email.padEnd(28);
            console.log(`│  ${role} │  ${email} │  ${DEFAULT_PASSWORD} │`);
        });
        console.log('└─────────────────────────────────────────────────────────────┘');

    } catch (err) {
        console.error('\nERROR:', err);
    }

    process.exit();
}

seedAll();
