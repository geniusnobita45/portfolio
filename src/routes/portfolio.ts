import { Router, Request, Response } from 'express';
import { supabase } from '../models/supabase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const [projectsRes, skillsRes, certificatesRes] = await Promise.all([
            supabase.from('projects').select('*').order('sort_order', { ascending: true }),
            supabase.from('skills').select('*').order('sort_order', { ascending: true }),
            supabase.from('certificates').select('*').order('sort_order', { ascending: true }),
        ]);

        if (projectsRes.error) throw projectsRes.error;
        if (skillsRes.error) throw skillsRes.error;
        if (certificatesRes.error) throw certificatesRes.error;

        res.json({
            projects: projectsRes.data,
            skills: skillsRes.data,
            certificates: certificatesRes.data,
        });
    } catch (error: any) {
        console.error('Error fetching portfolio data:', error.message);
        res.status(500).json({ success: false, error: 'Failed to load portfolio data' });
    }
});

export default router;
