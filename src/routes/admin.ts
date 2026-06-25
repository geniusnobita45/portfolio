import { Router, Request, Response } from 'express';
import path from 'path';
import { requireAdmin } from '../middleware/auth';
import { supabaseAdmin } from '../models/supabase';

const router = Router();

// Render HTML Pages
router.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'src/views/login.html'));
});

router.post('/login', (req: Request, res: Response) => {
    const { token } = req.body;
    const expectedToken = process.env.ADMIN_TOKEN;
    
    if (token === expectedToken) {
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.redirect('/admin');
    } else {
        res.status(401).send('Invalid token. <a href="/admin/login">Try again</a>');
    }
});

router.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('admin_token');
    res.redirect('/admin/login');
});

router.get('/', requireAdmin, (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'src/views/dashboard.html'));
});

// Admin API endpoints (protected)
// Used by the dashboard.html frontend to fetch and update data

router.get('/api/data', requireAdmin, async (req: Request, res: Response) => {
    try {
        const [projects, skills, certs] = await Promise.all([
            supabaseAdmin.from('projects').select('*').order('sort_order', { ascending: true }),
            supabaseAdmin.from('skills').select('*').order('sort_order', { ascending: true }),
            supabaseAdmin.from('certificates').select('*').order('sort_order', { ascending: true }),
        ]);
        res.json({
            projects: projects.data,
            skills: skills.data,
            certificates: certs.data
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Projects
router.post('/api/projects', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('projects').insert([req.body]);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.put('/api/projects/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('projects').update(req.body).eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.delete('/api/projects/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('projects').delete().eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

// Skills
router.post('/api/skills', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('skills').insert([req.body]);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.put('/api/skills/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('skills').update(req.body).eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.delete('/api/skills/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('skills').delete().eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

// Certificates
router.post('/api/certificates', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('certificates').insert([req.body]);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.put('/api/certificates/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('certificates').update(req.body).eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

router.delete('/api/certificates/:id', requireAdmin, async (req: Request, res: Response) => {
    const { data, error } = await supabaseAdmin.from('certificates').delete().eq('id', req.params.id);
    if (error) res.status(400).json({ error: error.message });
    else res.json(data);
});

export default router;
