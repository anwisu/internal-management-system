import Artist from '../models/Artist.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get all artists with optional filtering and pagination
 */
export const getArtists = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const artists = await Artist.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Artist.countDocuments(query);

    res.json({
      data: artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single artist by ID
 */
export const getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    res.json({ data: artist });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new artist
 */
export const createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json({ data: artist });
  } catch (error) {
    next(error);
  }
};

/**
 * Update artist
 */
export const updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    res.json({ data: artist });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete artist
 */
export const deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

