import { Card, CardBody, Chip, Button, Avatar } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDateTime } from '../../../utils/formatters';

/**
 * Event Card component
 * Displays event information in a card format
 */
function EventCard({ event, onEdit, onDelete }) {
  const statusColorMap = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
    cancelled: 'red',
  };

  return (
    <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <CardBody className="p-0">
        {(event.imageUrl?.url || event.imageUrl) && (
          <img
            src={event.imageUrl?.url || event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-medium text-gray-700">{event.title}</h3>
          <Chip
            value={event.status}
            color={statusColorMap[event.status] || 'gray'}
            size="sm"
            className="rounded-lg"
          />
        </div>
        {event.venue && (
          <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
        )}
        {event.startDate && (
          <p className="text-sm text-gray-500 mb-2">{formatDateTime(event.startDate)}</p>
        )}
        {event.description && (
          <p className="text-base text-gray-700 mb-4 line-clamp-2">{event.description}</p>
        )}
        {event.artists && event.artists.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-gray-500 mr-2">Artists:</p>
            <div className="flex -space-x-2">
              {event.artists.slice(0, 3).map((artist) => (
                <Avatar
                  key={artist._id}
                  src={artist.imageUrl?.url || artist.imageUrl}
                  alt={artist.name}
                  size="sm"
                  variant="circular"
                />
              ))}
              {event.artists.length > 3 && (
                <Avatar
                  size="sm"
                  variant="circular"
                  className="bg-gray-300 text-gray-700"
                >
                  +{event.artists.length - 3}
                </Avatar>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => onEdit(event)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Edit ${event.title}`}
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onDelete(event)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={`Delete ${event.title}`}
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            <span>Delete</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default EventCard;

