import { useState } from 'react';
import { Card, CardBody, Typography, Chip, Button, Avatar } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatDate, formatDateTime } from '../../../utils/formatters';
import ImagePreviewModal from '../../common/ImagePreviewModal';

/**
 * Event Card component
 * Displays event information in a card format
 */
function EventCard({ event, onEdit, onDelete }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const statusColorMap = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'gray',
    cancelled: 'red',
  };

  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody className="p-6">
          {event.imageUrl && (
            <div className="relative group mb-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setIsPreviewOpen(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                <Button
                  size="sm"
                  variant="text"
                  color="white"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <EyeIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
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
    <ImagePreviewModal
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      imageUrl={event.imageUrl}
      title={event.title}
    />
    </>
  );
}

export default EventCard;

