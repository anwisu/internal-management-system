import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
} from '../controllers/eventController.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import { parseMultipartJson } from '../middleware/parseMultipartJson.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.route('/').get(getEvents).post(uploadSingle, handleUploadError, parseMultipartJson, createEvent);
router.route('/:id').get(getEvent).put(uploadSingle, handleUploadError, parseMultipartJson, updateEvent).delete(deleteEvent);

export default router;

