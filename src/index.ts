import express from 'express';
import cors from 'cors';
import path from 'path';
import pino from 'pino';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const logger = pino();

// Middleware
app.use(cors()); // In production, configure this to specific origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static front-end files
// Assuming index.ts is compiled to dist/index.js and public is at project root
app.use(express.static(path.join(process.cwd(), 'public')));

// Admin Routes (must come before the catch-all fallback)
app.use('/admin', adminRoutes);

// API Routes
app.use('/api', apiRoutes);

// Fallback to index.html for SPA (if needed in future) or just handle 404s
app.use((req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

// Error handling middleware (should be last)
app.use(errorHandler);

export { app, logger };
