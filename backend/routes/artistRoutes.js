import express from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artistController.js';

const router = express.Router();

router.route('/').get(getArtists).post(createArtist);
router.route('/:id').get(getArtist).put(updateArtist).delete(deleteArtist);

export default router;

