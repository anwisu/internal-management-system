import React from 'react';
import { Card, CardBody, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { FiMusic } from 'react-icons/fi';

/**
 * Artist Card component
 * Displays artist information in a card format
 */
function ArtistCard({ artist, onView, onEdit, onDelete }) {
  const statusColorMap = {
    active: 'green',
    inactive: 'gray',
    pending: 'amber',
  };

  return (
    <Card className="bg-white/90 backdrop-blur rounded-2xl border border-white/70 shadow-glass hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-200">
      <CardBody className="p-0 flex flex-col">
        <div className="relative">
          {(artist.imageUrl?.url || artist.imageUrl) ? (
            <img
              src={artist.imageUrl?.url || artist.imageUrl}
              alt={artist.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-48 rounded-t-2xl bg-gradient-to-br from-primary-100 to-white flex items-center justify-center text-primary-500">
              <FiMusic className="w-10 h-10" aria-hidden="true" />
            </div>
          )}
          <Chip
            value={artist.status}
            color={statusColorMap[artist.status] || 'gray'}
            size="sm"
            className="absolute top-4 left-4 rounded-full bg-white/90 text-slate-700 shadow"
          />
        </div>
        <div className="p-5 flex flex-col flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{artist.name}</h3>
            {artist.genre && (
              <p className="text-sm text-slate-500 mt-1">{artist.genre}</p>
            )}
          </div>
          {artist.bio && (
            <p className="text-sm text-slate-600 line-clamp-3 flex-1">{artist.bio}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              variant="outlined"
              onClick={() => onView(artist)}
              className="border-primary-200 text-primary-600 px-3 py-2 rounded-full hover:bg-primary-50 shadow-sm transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`View details for ${artist.name}`}
            >
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
              <span>View</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onEdit(artist)}
              className="bg-primary-600 text-white px-3 py-2 rounded-full hover:bg-primary-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`Edit ${artist.name}`}
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onDelete(artist)}
              className="bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 shadow-soft-lg transition-all duration-200 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              aria-label={`Delete ${artist.name}`}
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

export default React.memo(ArtistCard);

