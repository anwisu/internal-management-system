import Artist from '../models/Artist.js';
import { NotFoundError } from '../utils/errors.js';
import { uploadToCloudinary, deleteOldImage } from '../utils/cloudinaryUpload.js';

/**
 * Get all artists with optional filtering and pagination
 */
export const getArtists = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = status ? { status } : {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

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

    // Validate required fields
    if (!artistData.name || typeof artistData.name !== 'string' || artistData.name.trim() === '') {
      console.error('Validation failed - name is missing or invalid');
      return res.status(400).json({
        error: {
          message: 'Artist name is required',
          code: 400,
        },
      });
    }

    // Trim the name field
    artistData.name = artistData.name.trim();

    // Ensure socialMedia is an object, not a string
    if (artistData.socialMedia) {
      if (typeof artistData.socialMedia === 'string') {
        try {
          artistData.socialMedia = JSON.parse(artistData.socialMedia);
          console.log('Parsed socialMedia in controller:', artistData.socialMedia);
        } catch (error) {
          console.error('Failed to parse socialMedia in controller:', error);
          artistData.socialMedia = {};
        }
      }
      // Ensure it's a proper object with the expected structure
      if (typeof artistData.socialMedia === 'object' && !Array.isArray(artistData.socialMedia)) {
        artistData.socialMedia = {
          instagram: artistData.socialMedia.instagram || '',
          twitter: artistData.socialMedia.twitter || '',
          youtube: artistData.socialMedia.youtube || '',
        };
      } else {
        artistData.socialMedia = {};
      }
    } else {
      artistData.socialMedia = {};
    }

    // Handle image upload if file is provided
    // Support both req.file (from upload.single) and req.files (from upload.fields)
    const file = req.file || (req.files && req.files.image && req.files.image[0]);
    if (file) {
      try {
        const imageData = await uploadToCloudinary(file.buffer, 'artists');
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

    // Ensure socialMedia is an object, not a string
    if (updateData.socialMedia) {
      if (typeof updateData.socialMedia === 'string') {
        try {
          updateData.socialMedia = JSON.parse(updateData.socialMedia);
          console.log('Parsed socialMedia in update controller:', updateData.socialMedia);
        } catch (error) {
          console.error('Failed to parse socialMedia in update controller:', error);
          updateData.socialMedia = {};
        }
      }
      // Ensure it's a proper object with the expected structure
      if (typeof updateData.socialMedia === 'object' && !Array.isArray(updateData.socialMedia)) {
        updateData.socialMedia = {
          instagram: updateData.socialMedia.instagram || '',
          twitter: updateData.socialMedia.twitter || '',
          youtube: updateData.socialMedia.youtube || '',
        };
      } else {
        updateData.socialMedia = {};
      }
    } else {
      // If socialMedia is not provided, keep the existing one or set to empty
      updateData.socialMedia = artist.socialMedia || {};
    }

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

