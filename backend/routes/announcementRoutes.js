import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
} from '../controllers/announcementController.js';

const router = express.Router();

router.get('/active', getActiveAnnouncements);
router.route('/').get(getAnnouncements).post(createAnnouncement);
router.route('/:id').get(getAnnouncement).put(updateAnnouncement).delete(deleteAnnouncement);

export default router;

