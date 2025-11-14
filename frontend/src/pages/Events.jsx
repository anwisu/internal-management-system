import { useState, useEffect } from 'react';
import { Button, Input, Chip } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import EventCard from '../components/features/events/EventCard';
import Modal from '../components/common/Modal';
import EventForm from '../components/forms/EventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../store/slices/eventSlice';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Events page component
 * Displays and manages event information
 */
function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { success, error: showError } = useToast();
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchEvents({ status: debouncedSearch ? undefined : 'upcoming' }));
  }, [dispatch, debouncedSearch]);

  const filteredEvents = debouncedSearch
    ? events.filter((event) =>
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.venue?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : events;

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete ${event.title}?`)) {
      try {
        await dispatch(deleteEvent(event._id)).unwrap();
        success('Event deleted successfully');
      } catch (err) {
        showError(err || 'Failed to delete event');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedEvent) {
        await dispatch(updateEvent({ id: selectedEvent._id, data: formData })).unwrap();
        success('Event updated successfully');
      } else {
        await dispatch(createEvent(formData)).unwrap();
        success('Event created successfully');
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      showError(err || 'Failed to save event');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <section className="space-y-4">
        <Chip value="Event command center" className="w-fit bg-primary-50 text-primary-700 font-semibold" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-gray-900 flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-primary-100 text-primary-600">
                <FiCalendar className="w-5 h-5" aria-hidden="true" />
              </span>
              Events & showcases
            </h1>
            <p className="text-base text-blue-gray-500 max-w-2xl">
              Design memorable experiences, align venues, and ensure the right artists take the stage.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary-600 text-white px-5 py-3 rounded-full hover:bg-primary-700 shadow-soft-lg flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-500 w-full sm:w-auto"
            aria-label="Add new event"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span>Schedule event</span>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <Input
            id="event-search"
            type="text"
            placeholder="Search events by title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="h-5 w-5 text-blue-gray-400" aria-hidden="true" />}
            className="pr-8 rounded-2xl bg-white/80 border border-slate-200 shadow-glass"
            autoFocus={false}
            aria-label="Search events by title or venue"
          />
        </div>
        <p className="text-sm text-blue-gray-500">
          Displaying <span className="font-semibold text-blue-gray-900">{filteredEvents.length}</span> event{filteredEvents.length !== 1 && 's'}
        </p>
      </section>

      {filteredEvents.length === 0 ? (
        <EmptyState
          message={debouncedSearch ? 'No events found' : 'No events available'}
          actionLabel={!debouncedSearch ? 'Add Event' : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Edit Event' : 'Create Event'}
        size="lg"
        aria-label={selectedEvent ? 'Edit event form' : 'Create event form'}
      >
        <EventForm
          event={selectedEvent}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Events;
