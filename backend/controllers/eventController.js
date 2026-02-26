import Event from '../models/Event.js';
import { NotFoundError } from '../utils/errors.js';
import { uploadToCloudinary, deleteOldImage } from '../utils/cloudinaryUpload.js';

/**
 * Get all events with optional filtering and pagination
 */
export const getEvents = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = status ? { status } : {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

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
    const eventData = { ...req.body };

    // Ensure artists is an array, not a string
    if (eventData.artists) {
      if (typeof eventData.artists === 'string') {
        try {
          eventData.artists = JSON.parse(eventData.artists);
          console.log('Parsed artists in createEvent controller:', eventData.artists);
        } catch (error) {
          console.error('Failed to parse artists in createEvent controller:', error);
          eventData.artists = [];
        }
      }
      // Ensure it's an array
      if (!Array.isArray(eventData.artists)) {
        eventData.artists = [];
      }
    } else {
      eventData.artists = [];
    }

    // Handle image upload if file is provided
    if (req.file) {
      try {
        const imageData = await uploadToCloudinary(req.file.buffer, 'events');
        eventData.imageUrl = imageData;
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    const event = await Event.create(eventData);
    const populatedEvent = await Event.findById(event._id).populate(
      'artists',
      'name imageUrl'
    );
    res.status(201).json({
      data: populatedEvent,
      message: 'Event created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event
 */
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const updateData = { ...req.body };

    // Ensure artists is an array, not a string
    if (updateData.artists) {
      if (typeof updateData.artists === 'string') {
        try {
          updateData.artists = JSON.parse(updateData.artists);
          console.log('Parsed artists in updateEvent controller:', updateData.artists);
        } catch (error) {
          console.error('Failed to parse artists in updateEvent controller:', error);
          updateData.artists = [];
        }
      }
      // Ensure it's an array
      if (!Array.isArray(updateData.artists)) {
        updateData.artists = [];
      }
    } else {
      // If artists is not provided, keep the existing one or set to empty
      updateData.artists = event.artists || [];
    }

    // Handle image upload if new file is provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary
        await deleteOldImage(event.imageUrl);

        // Upload new image
        const imageData = await uploadToCloudinary(req.file.buffer, 'events');
        updateData.imageUrl = imageData;
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    // Update event
    Object.assign(event, updateData);
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate(
      'artists',
      'name imageUrl'
    );

    res.json({
      data: populatedEvent,
      message: 'Event updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    // Delete image from Cloudinary if exists
    if (event.imageUrl && event.imageUrl.public_id) {
      const { deleteFromCloudinary } = await import('../utils/cloudinaryUpload.js');
      await deleteFromCloudinary(event.imageUrl.public_id);
    }

    await Event.findByIdAndDelete(req.params.id);

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

