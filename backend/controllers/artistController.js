import Artist from '../models/Artist.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import cloudinary from '../config/cloudinary.js';

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

/**
 * Upload image for artist
 */
export const uploadArtistImage = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    // Delete old image from Cloudinary if exists
    if (artist.imageUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = artist.imageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/').split('.')[0];
        const publicId = `artists/${publicIdWithExtension.split('/')[1]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        // Log error but don't fail the upload
        console.error('Error deleting old image:', error);
      }
    }

    // Update artist with new image URL
    artist.imageUrl = req.file.path;
    await artist.save();

    res.json({
      message: 'Image uploaded successfully',
      data: {
        imageUrl: artist.imageUrl,
        artist: artist,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get artist image
 */
export const getArtistImage = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    if (!artist.imageUrl) {
      throw new NotFoundError('No image found for this artist');
    }

    res.json({
      data: {
        imageUrl: artist.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete artist image
 */
export const deleteArtistImage = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    if (!artist.imageUrl) {
      throw new NotFoundError('No image found for this artist');
    }

    // Delete image from Cloudinary
    try {
      const urlParts = artist.imageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/').split('.')[0];
      const publicId = `artists/${publicIdWithExtension.split('/')[1]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Continue to remove URL from database even if Cloudinary deletion fails
    }

    // Remove image URL from artist
    artist.imageUrl = '';
    await artist.save();

    res.json({
      message: 'Image deleted successfully',
      data: artist,
    });
  } catch (error) {
    next(error);
  }
};

