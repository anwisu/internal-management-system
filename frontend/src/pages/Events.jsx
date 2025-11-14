import { useState, useEffect } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FiSearch } from 'react-icons/fi';
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">Events</h1>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
          aria-label="Add new event"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>Add Event</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <Input
            id="event-search"
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch className="h-5 w-5" aria-hidden="true" />}
            className="pr-8 rounded-lg shadow-md"
            autoFocus={false}
            aria-label="Search events by title or venue"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          message={debouncedSearch ? 'No events found' : 'No events available'}
          actionLabel={!debouncedSearch ? 'Add Event' : undefined}
          onAction={!debouncedSearch ? handleCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
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
