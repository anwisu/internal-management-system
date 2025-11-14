import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  uploadEventImage,
  getEventImage,
  deleteEventImage,
} from '../controllers/eventController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.route('/').get(getEvents).post(createEvent);

// Image routes - must be before /:id to avoid route conflicts
router
  .route('/:id/image')
  .post(uploadSingle('image'), uploadEventImage)
  .get(getEventImage)
  .delete(deleteEventImage);

router.route('/:id').get(getEvent).put(updateEvent).delete(deleteEvent);

export default router;

