import express from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artistController.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import { parseMultipartJson } from '../middleware/parseMultipartJson.js';

const router = express.Router();

router.route('/').get(getArtists).post(uploadSingle, handleUploadError, parseMultipartJson, createArtist);
router.route('/:id').get(getArtist).put(uploadSingle, handleUploadError, parseMultipartJson, updateArtist).delete(deleteArtist);

export default router;

