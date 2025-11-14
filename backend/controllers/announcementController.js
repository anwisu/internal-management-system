import Announcement from '../models/Announcement.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get all announcements with optional filtering
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = isActive !== undefined ? { isActive: isActive === 'true' } : {};

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 });

    res.json({ data: announcements });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single announcement by ID
 */
export const getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    res.json({ data: announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new announcement
 */
export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json({ data: announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    res.json({ data: announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active announcements
 */
export const getActiveAnnouncements = async (req, res, next) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: now } },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);

    res.json({ data: announcements });
  } catch (error) {
    next(error);
  }
};

