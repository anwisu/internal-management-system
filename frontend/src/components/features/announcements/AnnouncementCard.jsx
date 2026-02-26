import { Card, CardBody, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { BsMegaphone } from "react-icons/bs";
import { formatDate } from '../../../utils/formatters';

/**
 * Announcement Card component
 * Displays announcement information in a card format
 */
function AnnouncementCard({ announcement, onView, onEdit, onDelete }) {
  const priorityColorMap = {
    high: 'red',
    medium: 'amber',
    low: 'blue',
  };

  return (
    <Card className="bg-white/90 backdrop-blur rounded-2xl border border-white/70 shadow-glass hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-200">
      <CardBody className="p-0 flex flex-col">
        <div className="p-5 space-y-3 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-primary-100 text-primary-600">
                <BsMegaphone className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {announcement.title}
                </h3>
                {announcement.author && (
                  <p className="text-sm text-slate-500">
                    By {announcement.author}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Chip
                value={announcement.priority}
                color={priorityColorMap[announcement.priority] || "gray"}
                size="sm"
                className="rounded-full"
              />
              {announcement.isActive && (
                <Chip
                  value="Active"
                  color="green"
                  size="sm"
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          {announcement.content && (
            <p className="text-sm text-slate-600 line-clamp-4">
              {announcement.content}
            </p>
          )}
        </div>
        <div className="px-5 pb-5 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-100">
          {announcement.createdAt && (
            <span>Updated {formatDate(announcement.createdAt)}</span>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlined"
              onClick={() => onView(announcement)}
              className="border-primary-200 text-primary-600 px-3 py-2 rounded-full hover:bg-primary-50 shadow-sm transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`View details for ${announcement.title}`}
            >
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
              <span>View</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onEdit(announcement)}
              className="bg-primary-600 text-white px-3 py-2 rounded-full hover:bg-primary-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`Edit ${announcement.title}`}
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onDelete(announcement)}
              className="bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              aria-label={`Delete ${announcement.title}`}
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AnnouncementCard;

