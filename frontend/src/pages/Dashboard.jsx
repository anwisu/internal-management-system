import { useEffect } from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDashboardStats,
  fetchUpcomingEvents,
  fetchActiveAnnouncements,
} from '../store/slices/dashboardSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/features/events/EventCard';
import AnnouncementCard from '../components/features/announcements/AnnouncementCard';
import { Link } from 'react-router-dom';
import { Button } from '@material-tailwind/react';

/**
 * Dashboard page component
 * Main landing page with statistics and recent items
 */
function Dashboard() {
  const dispatch = useAppDispatch();
  const { stats, upcomingEvents, activeAnnouncements, loading } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUpcomingEvents());
    dispatch(fetchActiveAnnouncements());
  }, [dispatch]);

  if (loading.stats || loading.events || loading.announcements) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Typography variant="h2" className="mb-6">
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md">
          <CardBody className="p-6">
            <Typography variant="h6" color="gray" className="mb-2">
              Artists
            </Typography>
            <Typography variant="h3" color="blue-gray">
              {stats?.artists?.total || 0}
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              {stats?.artists?.active || 0} active
            </Typography>
          </CardBody>
        </Card>

        <Card className="shadow-md">
          <CardBody className="p-6">
            <Typography variant="h6" color="gray" className="mb-2">
              Events
            </Typography>
            <Typography variant="h3" color="blue-gray">
              {stats?.events?.total || 0}
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              {stats?.events?.upcoming || 0} upcoming
            </Typography>
          </CardBody>
        </Card>

        <Card className="shadow-md">
          <CardBody className="p-6">
            <Typography variant="h6" color="gray" className="mb-2">
              Announcements
            </Typography>
            <Typography variant="h3" color="blue-gray">
              {stats?.announcements?.total || 0}
            </Typography>
            <Typography variant="small" color="gray" className="mt-2">
              {stats?.announcements?.active || 0} active
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4">Upcoming Events</Typography>
          <Link to="/events">
            <Button size="sm" variant="text">
              View All
            </Button>
          </Link>
        </div>
        {(!upcomingEvents || upcomingEvents.length === 0) ? (
          <Card className="shadow-md">
            <CardBody className="p-6 text-center text-gray-500">
              No upcoming events
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event._id}>
                <Link to="/events">
                  <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Announcements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4">Active Announcements</Typography>
          <Link to="/announcements">
            <Button size="sm" variant="text">
              View All
            </Button>
          </Link>
        </div>
        {(!activeAnnouncements || activeAnnouncements.length === 0) ? (
          <Card className="shadow-md">
            <CardBody className="p-6 text-center text-gray-500">
              No active announcements
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement._id}>
                <Link to="/announcements">
                  <AnnouncementCard
                    announcement={announcement}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
