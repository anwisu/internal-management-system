import { Card, CardBody, Typography, Chip, Button, Avatar } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate, formatDateTime } from '../../../utils/formatters';

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
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardBody className="p-6">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-start justify-between mb-2">
          <Typography variant="h5" color="blue-gray">
            {event.title}
          </Typography>
          <Chip
            value={event.status}
            color={statusColorMap[event.status] || 'gray'}
            size="sm"
          />
        </div>
        {event.venue && (
          <Typography variant="small" color="gray" className="mb-2">
            {event.venue}
          </Typography>
        )}
        {event.startDate && (
          <Typography variant="small" color="gray" className="mb-2">
            {formatDateTime(event.startDate)}
          </Typography>
        )}
        {event.description && (
          <Typography variant="paragraph" color="gray" className="mb-4 line-clamp-2">
            {event.description}
          </Typography>
        )}
        {event.artists && event.artists.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Typography variant="small" className="mr-2">
              Artists:
            </Typography>
            <div className="flex -space-x-2">
              {event.artists.slice(0, 3).map((artist) => (
                <Avatar
                  key={artist._id}
                  src={artist.imageUrl}
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
            variant="outlined"
            color="blue"
            onClick={() => onEdit(event)}
            className="flex items-center gap-1"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outlined"
            color="red"
            onClick={() => onDelete(event)}
            className="flex items-center gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default EventCard;

