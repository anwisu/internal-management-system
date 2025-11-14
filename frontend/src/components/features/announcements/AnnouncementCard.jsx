import { Card, CardBody, Typography, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/formatters';

/**
 * Announcement Card component
 * Displays announcement information in a card format
 */
function AnnouncementCard({ announcement, onEdit, onDelete }) {
  const priorityColorMap = {
    high: 'red',
    medium: 'amber',
    low: 'blue',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Typography variant="h5" color="blue-gray">
            {announcement.title}
          </Typography>
          <div className="flex gap-2">
            <Chip
              value={announcement.priority}
              color={priorityColorMap[announcement.priority] || 'gray'}
              size="sm"
            />
            {announcement.isActive && (
              <Chip value="Active" color="green" size="sm" />
            )}
          </div>
        </div>
        {announcement.content && (
          <Typography variant="paragraph" color="gray" className="mb-4">
            {announcement.content}
          </Typography>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {announcement.author && (
            <span>By: {announcement.author}</span>
          )}
          {announcement.createdAt && (
            <span>{formatDate(announcement.createdAt)}</span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            onClick={() => onEdit(announcement)}
            className="flex items-center gap-1"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outlined"
            color="red"
            onClick={() => onDelete(announcement)}
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

export default AnnouncementCard;

