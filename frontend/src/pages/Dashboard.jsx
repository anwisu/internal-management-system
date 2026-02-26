import { useEffect } from 'react';
import { Card, CardBody, Chip } from '@material-tailwind/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDashboardStats,
  fetchUpcomingEvents,
  fetchActiveAnnouncements,
} from '../store/slices/dashboardSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EventCard from '../components/features/events/EventCard';
import AnnouncementCard from '../components/features/announcements/AnnouncementCard';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { FiActivity, FiCalendar, FiBell, FiAlertCircle, FiDollarSign } from 'react-icons/fi';

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
    <div className="w-full space-y-10">
      <section className="space-y-4">
        <div className="flex flex-col gap-4">
          <Chip
            value="Welcome back"
            color="blue"
            variant="ghost"
            className="w-fit bg-primary-50 text-primary-700 font-semibold"
          />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-gray-900">
                Dashboard
              </h1>
              <p className="text-base text-blue-gray-500 max-w-2xl">
                Monitor artists, upcoming events, and community announcements
                from a single, elegant control room.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/events">
                <Button className="bg-primary-600 hover:bg-primary-700 shadow-soft-lg text-sm px-5 py-2 rounded-full">
                  Schedule event
                </Button>
              </Link>
              <Link to="/artists">
                <Button
                  variant="outlined"
                  className="border-primary-200 text-primary-600 px-5 py-2 rounded-full"
                >
                  Add artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-4">
          <Card className="rounded-2xl border border-white/70 bg-white/90 shadow-glass p-6 hover:-translate-y-1 hover:shadow-soft-lg transition">
            <CardBody className="p-0 space-y-2">
              <div className="flex items-center gap-3 text-blue-gray-500 text-sm">
                <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                  <FiActivity className="w-5 h-5" aria-hidden="true" />
                </div>
                Artists overview
              </div>
              <h3 className="text-4xl font-extrabold text-blue-gray-900">
                {stats?.artists?.total || 0}
              </h3>
              <p className="text-sm text-blue-gray-500">
                <span className="font-semibold text-primary-600">
                  {stats?.artists?.active || 0}
                </span>{" "}
                active profiles
              </p>
            </CardBody>
          </Card>
          <Card className="rounded-2xl border border-white/70 bg-white/90 shadow-glass p-6 hover:-translate-y-1 hover:shadow-soft-lg transition">
            <CardBody className="p-0 space-y-2">
              <div className="flex items-center gap-3 text-blue-gray-500 text-sm">
                <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                  <FiCalendar className="w-5 h-5" aria-hidden="true" />
                </div>
                Event pipeline
              </div>
              <h3 className="text-4xl font-extrabold text-blue-gray-900">
                {stats?.events?.total || 0}
              </h3>
              <p className="text-sm text-blue-gray-500">
                <span className="font-semibold text-primary-600">
                  {stats?.events?.upcoming || 0}
                </span>{" "}
                upcoming engagements
              </p>
            </CardBody>
          </Card>
          <Card className="rounded-2xl border border-white/70 bg-white/90 shadow-glass p-6 hover:-translate-y-1 hover:shadow-soft-lg transition">
            <CardBody className="p-0 space-y-2">
              <div className="flex items-center gap-3 text-blue-gray-500 text-sm">
                <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                  <FiBell className="w-5 h-5" aria-hidden="true" />
                </div>
                Announcements radar
              </div>
              <h3 className="text-4xl font-extrabold text-blue-gray-900">
                {stats?.announcements?.total || 0}
              </h3>
              <p className="text-sm text-blue-gray-500">
                <span className="font-semibold text-primary-600">
                  {stats?.announcements?.active || 0}
                </span>{" "}
                actively broadcasting
              </p>
            </CardBody>
          </Card>

          <Card className="rounded-2xl border border-white/70 bg-white/90 shadow-glass p-6 hover:-translate-y-1 hover:shadow-soft-lg transition">
            <CardBody className="p-0 space-y-2">
              <div className="flex items-center gap-3 text-blue-gray-500 text-sm">
                <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                  <FiDollarSign className="w-5 h-5" aria-hidden="true" />
                </div>
                Ticketing Revenue (Upcoming)
              </div>
              <h3 className="text-4xl font-extrabold text-blue-gray-900">
                ${stats?.events?.ticketing?.revenue || 0}
              </h3>
              <p className="text-sm text-blue-gray-500">
                <span className="font-semibold text-primary-600">
                  {stats?.events?.ticketing?.sold || 0} / {stats?.events?.ticketing?.capacity || 0}
                </span>{" "}
                tickets sold
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-gray-400">
              Events
            </p>
            <h2 className="text-2xl font-semibold text-blue-gray-900">
              Upcoming experiences
            </h2>
            <p className="text-sm text-blue-gray-500 mt-1">
              Preview what’s next in the calendar.
            </p>
          </div>
          <Link to="/events" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-primary-600 text-white px-5 py-2 rounded-full shadow-soft-lg hover:bg-primary-700 w-full sm:w-auto"
              aria-label="View all events"
            >
              View all
            </Button>
          </Link>
        </div>
        {!upcomingEvents || upcomingEvents.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            message="Nothing on the horizon just yet."
            actionLabel="Plan your next event!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event._id}>
                <Link
                  to="/events"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                >
                  <EventCard
                    event={event}
                    hideActions={true}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Announcements */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-gray-400">
              Announcements
            </p>
            <h2 className="text-2xl font-semibold text-blue-gray-900">
              Active broadcasts
            </h2>
            <p className="text-sm text-blue-gray-500 mt-1">
              Keep everyone in sync with clear messaging.
            </p>
          </div>
          <Link to="/announcements" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="bg-primary-600 text-white px-5 py-2 rounded-full shadow-soft-lg hover:bg-primary-700 w-full sm:w-auto"
              aria-label="View all announcements"
            >
              View all
            </Button>
          </Link>
        </div>
        {!activeAnnouncements || activeAnnouncements.length === 0 ? (
          <EmptyState
            icon={FiBell}
            message="No active announcements."
            actionLabel="Share an update to keep the team aligned."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {activeAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement._id}>
                <Link
                  to="/announcements"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                >
                  <AnnouncementCard
                    announcement={announcement}
                    hideActions={true}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
