import { Router } from 'express';
import portfolioRoutes from './portfolio';
import contactRoutes from './contact';

const router = Router();

router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default router;
