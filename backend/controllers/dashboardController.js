import Artist from '../models/Artist.js';
import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalArtists,
      activeArtists,
      totalEvents,
      upcomingEvents,
      totalAnnouncements,
      activeAnnouncements,
    ] = await Promise.all([
      Artist.countDocuments(),
      Artist.countDocuments({ status: 'active' }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'upcoming' }),
      Announcement.countDocuments(),
      Announcement.countDocuments({ isActive: true }),
    ]);

    res.json({
      data: {
        artists: {
          total: totalArtists,
          active: activeArtists,
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
        },
        announcements: {
          total: totalAnnouncements,
          active: activeAnnouncements,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

