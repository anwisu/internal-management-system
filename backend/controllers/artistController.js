import Artist from '../models/Artist.js';
import { NotFoundError } from '../utils/errors.js';
import { uploadToCloudinary, deleteOldImage } from '../utils/cloudinaryUpload.js';

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
    const artistData = { ...req.body };

    // Handle image upload if file is provided
    if (req.file) {
      try {
        const imageData = await uploadToCloudinary(req.file.buffer, 'artists');
        artistData.imageUrl = imageData;
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    const artist = await Artist.create(artistData);
    res.status(201).json({
      data: artist,
      message: 'Artist created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update artist
 */
export const updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    const updateData = { ...req.body };

    // Handle image upload if new file is provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary
        await deleteOldImage(artist.imageUrl);

        // Upload new image
        const imageData = await uploadToCloudinary(req.file.buffer, 'artists');
        updateData.imageUrl = imageData;
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    // Update artist
    Object.assign(artist, updateData);
    await artist.save();

    res.json({
      data: artist,
      message: 'Artist updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete artist
 */
export const deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      throw new NotFoundError('Artist not found');
    }

    // Delete image from Cloudinary if exists
    if (artist.imageUrl && artist.imageUrl.public_id) {
      const { deleteFromCloudinary } = await import('../utils/cloudinaryUpload.js');
      await deleteFromCloudinary(artist.imageUrl.public_id);
    }

    await Artist.findByIdAndDelete(req.params.id);

    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

