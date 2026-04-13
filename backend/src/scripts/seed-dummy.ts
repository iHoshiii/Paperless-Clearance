import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';

async function seedDummyData() {
    console.log('--- DUMMY DATA SEEDING ---');

    try {
        const passwordHash = await bcrypt.hash('password123', 12);

        // 1. Check/Create Mother Organization
        let orgId;
        const { data: existingOrg } = await supabase
            .from('organizations')
            .select('id')
            .eq('name', 'Central Administration')
            .single();

        if (existingOrg) {
            orgId = existingOrg.id;
            console.log('Org already exists.');
        } else {
            const { data: newOrg, error: orgError } = await supabase
                .from('organizations')
                .insert({ name: 'Central Administration', description: 'Main Mother Organization' })
                .select()
                .single();
            if (orgError) throw orgError;
            orgId = newOrg.id;
            console.log('Created org.');
        }

        // 2. Mother Org User
        const email1 = 'motherorg@test.com';
        const { data: user1 } = await supabase.from('users').select('id').eq('email', email1).single();
        if (!user1) {
            const { error: err } = await supabase.from('users').insert({
                email: email1,
                password_hash: passwordHash,
                first_name: 'Maria',
                last_name: 'Central',
                role: 'mother_organization',
                organization_id: orgId,
                is_active: true
            });
            if (err) throw err;
            console.log('Created motherorg@test.com');
        } else {
            console.log('User motherorg@test.com already exists.');
        }

        // 3. Student User
        const email2 = 'student@test.com';
        const { data: user2 } = await supabase.from('users').select('id').eq('email', email2).single();
        if (!user2) {
            const { error: err } = await supabase.from('users').insert({
                email: email2,
                password_hash: passwordHash,
                first_name: 'John',
                last_name: 'Student',
                role: 'student',
                student_id: 'STUD-2024-001',
                department: 'IT Department',
                is_active: true
            });
            if (err) throw err;
            console.log('Created student@test.com');
        } else {
            console.log('User student@test.com already exists.');
        }

        // 4. Create an active Clearance Period if none exists
        const { data: existingPeriod } = await supabase.from('clearance_periods').select('id').eq('is_active', true).limit(1);
        if (existingPeriod && existingPeriod.length === 0) {
            const { error: periodError } = await supabase.from('clearance_periods').insert({
                name: '1st Semester 2024-2025',
                is_active: true,
                start_date: new Date().toISOString().split('T')[0]
            });
            if (periodError) throw periodError;
            console.log('Created active clearance period.');
        } else {
            console.log('Active clearance period already exists.');
        }

        console.log('--- SUCCESS ---');
        console.log('Mother Org: motherorg@test.com / password123');
        console.log('Student: student@test.com / password123');
    } catch (err) {
        console.error('ERROR:', err);
    }
    process.exit();
}

seedDummyData();
