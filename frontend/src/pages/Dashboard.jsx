import { useEffect } from 'react';
import { Card, CardBody } from '@material-tailwind/react';
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
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <CardBody className="p-0">
            <p className="text-sm text-gray-500 mb-2">Artists</p>
            <h3 className="text-3xl font-bold text-gray-700 mb-1">
              {stats?.artists?.total || 0}
            </h3>
            <p className="text-sm text-gray-500">
              {stats?.artists?.active || 0} active
            </p>
          </CardBody>
        </Card>

        <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <CardBody className="p-0">
            <p className="text-sm text-gray-500 mb-2">Events</p>
            <h3 className="text-3xl font-bold text-gray-700 mb-1">
              {stats?.events?.total || 0}
            </h3>
            <p className="text-sm text-gray-500">
              {stats?.events?.upcoming || 0} upcoming
            </p>
          </CardBody>
        </Card>

        <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <CardBody className="p-0">
            <p className="text-sm text-gray-500 mb-2">Announcements</p>
            <h3 className="text-3xl font-bold text-gray-700 mb-1">
              {stats?.announcements?.total || 0}
            </h3>
            <p className="text-sm text-gray-500">
              {stats?.announcements?.active || 0} active
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Upcoming Events</h2>
          <Link to="/events" className="w-full sm:w-auto">
            <Button 
              size="sm" 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              aria-label="View all events"
            >
              View All
            </Button>
          </Link>
        </div>
        {(!upcomingEvents || upcomingEvents.length === 0) ? (
          <Card className="bg-white rounded-xl shadow-md p-6">
            <CardBody className="p-0 text-center text-gray-500">
              No upcoming events
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event._id}>
                <Link to="/events" className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl">
                  <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Announcements */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Active Announcements</h2>
          <Link to="/announcements" className="w-full sm:w-auto">
            <Button 
              size="sm" 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              aria-label="View all announcements"
            >
              View All
            </Button>
          </Link>
        </div>
        {(!activeAnnouncements || activeAnnouncements.length === 0) ? (
          <Card className="bg-white rounded-xl shadow-md p-6">
            <CardBody className="p-0 text-center text-gray-500">
              No active announcements
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {activeAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement._id}>
                <Link to="/announcements" className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl">
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
