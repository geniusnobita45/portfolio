import request from 'supertest';
import { app } from '../src/index';

describe('Portfolio API', () => {
    it('GET /api/portfolio should return portfolio data', async () => {
        const res = await request(app).get('/api/portfolio');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('projects');
        expect(res.body).toHaveProperty('skills');
    });

    it('GET /api/health should return ok status', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
