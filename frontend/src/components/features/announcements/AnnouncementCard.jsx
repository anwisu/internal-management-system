import { Card, CardBody, Chip, Button } from '@material-tailwind/react';
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
    <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <CardBody className="p-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-medium text-gray-700">{announcement.title}</h3>
          <div className="flex gap-2">
            <Chip
              value={announcement.priority}
              color={priorityColorMap[announcement.priority] || 'gray'}
              size="sm"
              className="rounded-lg"
            />
            {announcement.isActive && (
              <Chip value="Active" color="green" size="sm" className="rounded-lg" />
            )}
          </div>
        </div>
        {announcement.content && (
          <p className="text-base text-gray-700 mb-4">{announcement.content}</p>
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
            onClick={() => onEdit(announcement)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Edit ${announcement.title}`}
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onDelete(announcement)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={`Delete ${announcement.title}`}
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            <span>Delete</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default AnnouncementCard;

