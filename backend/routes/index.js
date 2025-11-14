import express from 'express';
import artistRoutes from './artistRoutes.js';
import eventRoutes from './eventRoutes.js';
import announcementRoutes from './announcementRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/artists', artistRoutes);
router.use('/events', eventRoutes);
router.use('/announcements', announcementRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

