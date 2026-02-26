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
      eventTicketingStats,
    ] = await Promise.all([
      Artist.countDocuments(),
      Artist.countDocuments({ status: 'active' }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'upcoming' }),
      Announcement.countDocuments(),
      Announcement.countDocuments({ isActive: true }),
      Event.aggregate([
        { $match: { status: 'upcoming' } },
        {
          $group: {
            _id: null,
            totalCapacity: { $sum: '$capacity' },
            totalTicketsSold: { $sum: '$ticketsSold' },
            totalRevenue: { $sum: { $multiply: ['$ticketsSold', '$ticketPrice'] } }
          }
        }
      ])
    ]);

    const ticketing = eventTicketingStats[0] || { totalCapacity: 0, totalTicketsSold: 0, totalRevenue: 0 };

    res.json({
      data: {
        artists: {
          total: totalArtists,
          active: activeArtists,
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          ticketing: {
            capacity: ticketing.totalCapacity,
            sold: ticketing.totalTicketsSold,
            revenue: ticketing.totalRevenue,
          }
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

