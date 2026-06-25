import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that checks for admin authentication via a session cookie.
 * Redirects to /admin/login if not authenticated.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.admin_token;
    const expectedToken = process.env.ADMIN_TOKEN;

    if (!expectedToken) {
        res.status(503).json({ error: 'Admin access is not configured' });
        return;
    }

    if (token === expectedToken) {
        next();
        return;
    }

    // For API calls (JSON), return 401; for page loads, redirect to login
    if (req.headers.accept?.includes('application/json') || req.path.startsWith('/api/')) {
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        res.redirect('/admin/login');
    }
};
