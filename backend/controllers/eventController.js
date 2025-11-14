import Event from '../models/Event.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Get all events with optional filtering and pagination
 */
export const getEvents = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const events = await Event.find(query)
      .populate('artists', 'name imageUrl')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ startDate: 1 });

    const total = await Event.countDocuments(query);

    res.json({
      data: events,
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
 * Get single event by ID
 */
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'artists',
      'name bio imageUrl genre'
    );

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new event
 */
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    const populatedEvent = await Event.findById(event._id).populate(
      'artists',
      'name imageUrl'
    );
    res.status(201).json({ data: populatedEvent });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event
 */
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('artists', 'name imageUrl');

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date();
    const events = await Event.find({
      startDate: { $gte: now },
      status: { $in: ['upcoming', 'ongoing'] },
    })
      .populate('artists', 'name imageUrl')
      .sort({ startDate: 1 })
      .limit(10);

    res.json({ data: events });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload image for event
 */
export const uploadEventImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    // Delete old image from Cloudinary if exists
    if (event.imageUrl) {
      try {
        const urlParts = event.imageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/').split('.')[0];
        const publicId = `events/${publicIdWithExtension.split('/')[1]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Update event with new image URL
    event.imageUrl = req.file.path;
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate(
      'artists',
      'name imageUrl'
    );

    res.json({
      message: 'Image uploaded successfully',
      data: {
        imageUrl: event.imageUrl,
        event: populatedEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get event image
 */
export const getEventImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (!event.imageUrl) {
      throw new NotFoundError('No image found for this event');
    }

    res.json({
      data: {
        imageUrl: event.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event image
 */
export const deleteEventImage = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (!event.imageUrl) {
      throw new NotFoundError('No image found for this event');
    }

    // Delete image from Cloudinary
    try {
      const urlParts = event.imageUrl.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/').split('.')[0];
      const publicId = `events/${publicIdWithExtension.split('/')[1]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }

    // Remove image URL from event
    event.imageUrl = '';
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate(
      'artists',
      'name imageUrl'
    );

    res.json({
      message: 'Image deleted successfully',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

