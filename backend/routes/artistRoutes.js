import express from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  uploadArtistImage,
  getArtistImage,
  deleteArtistImage,
} from '../controllers/artistController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(getArtists).post(createArtist);

// Image routes - must be before /:id to avoid route conflicts
router
  .route('/:id/image')
  .post(uploadSingle('image'), uploadArtistImage)
  .get(getArtistImage)
  .delete(deleteArtistImage);

router.route('/:id').get(getArtist).put(updateArtist).delete(deleteArtist);

export default router;

