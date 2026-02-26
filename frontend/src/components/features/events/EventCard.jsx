import React from 'react';
import { Card, CardBody, Chip, Button, Avatar } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { FiCalendar } from 'react-icons/fi';
import { formatDateTime } from '../../../utils/formatters';

/**
 * Event Card component
 * Displays event information in a card format
 */
function EventCard({ event, onView, onEdit, onDelete, hideActions = false }) {
  const statusColorMap = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
    cancelled: 'red',
  };

  return (
    <Card className="bg-white/90 dark:bg-blue-gray-800/90 backdrop-blur rounded-2xl border border-white/70 dark:border-blue-gray-700/70 shadow-glass hover:-tranblue-gray-y-1 hover:shadow-soft-lg transition-all duration-200">
      <CardBody className="p-0 flex flex-col">
        <div className="relative">
          {(event.imageUrl?.url || event.imageUrl) ? (
            <img
              src={event.imageUrl?.url || event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-48 rounded-t-2xl bg-gradient-to-br from-primary-100 dark:from-blue-gray-700 to-white dark:to-blue-gray-800 flex items-center justify-center text-primary-500 dark:text-primary-400">
              <FiCalendar className="w-10 h-10" aria-hidden="true" />
            </div>
          )}
          <Chip
            value={event.status}
            color={statusColorMap[event.status] || 'gray'}
            size="sm"
            className="absolute top-4 left-4 rounded-full bg-white/90 dark:bg-blue-gray-800/90 text-blue-gray-700 dark:text-blue-gray-200 shadow"
          />
        </div>
        <div className="p-5 flex flex-col flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-blue-gray-900 dark:text-white">{event.title}</h3>
            {event.venue && (
              <p className="text-sm text-blue-gray-500 dark:text-blue-gray-400 mt-1">{event.venue}</p>
            )}
            {event.startDate && (
              <p className="text-xs text-blue-gray-400 dark:text-blue-gray-500">{formatDateTime(event.startDate)}</p>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-blue-gray-600 dark:text-blue-gray-300 line-clamp-3 flex-1">{event.description}</p>
          )}
          {event.artists && event.artists.length > 0 && (
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-blue-gray-400 dark:text-blue-gray-500">Artists</p>
              <div className="flex -space-x-2">
                {event.artists.slice(0, 3).map((artist) => (
                  <Avatar
                    key={artist._id}
                    src={artist.imageUrl?.url || artist.imageUrl}
                    alt={artist.name}
                    size="sm"
                    variant="circular"
                    className="ring-2 ring-white"
                  />
                ))}
                {event.artists.length > 3 && (
                  <Avatar
                    size="sm"
                    variant="circular"
                    className="bg-blue-gray-200 dark:bg-blue-gray-700 text-blue-gray-700 dark:text-blue-gray-300 ring-2 ring-white dark:ring-blue-gray-800"
                    aria-label={`+${event.artists.length - 3} more artists`}
                  >
                    +{event.artists.length - 3}
                  </Avatar>
                )}
              </div>
            </div>
          )}
          {!hideActions && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outlined"
                onClick={(e) => {
                  e.preventDefault();
                  onView(event);
                }}
                className="border-primary-200 text-primary-600 px-3 py-2 rounded-full hover:bg-primary-50 shadow-sm transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label={`View details for ${event.title}`}
              >
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                <span>View</span>
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(event);
                }}
                className="bg-primary-600 text-white px-3 py-2 rounded-full hover:bg-primary-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label={`Edit ${event.title}`}
              >
                <PencilIcon className="h-4 w-4" aria-hidden="true" />
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(event);
                }}
                className="bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                aria-label={`Delete ${event.title}`}
              >
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default React.memo(EventCard);

