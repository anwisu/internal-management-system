import { Card, CardBody, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Artist Card component
 * Displays artist information in a card format
 */
function ArtistCard({ artist, onEdit, onDelete }) {
  const statusColorMap = {
    active: 'green',
    inactive: 'gray',
    pending: 'amber',
  };

  return (
    <Card className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <CardBody className="p-0">
        {(artist.imageUrl?.url || artist.imageUrl) && (
          <img
            src={artist.imageUrl?.url || artist.imageUrl}
            alt={artist.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-medium text-gray-700">{artist.name}</h3>
          <Chip
            value={artist.status}
            color={statusColorMap[artist.status] || 'gray'}
            size="sm"
            className="rounded-lg"
          />
        </div>
        {artist.genre && (
          <p className="text-sm text-gray-500 mb-2">{artist.genre}</p>
        )}
        {artist.bio && (
          <p className="text-base text-gray-700 mb-4 line-clamp-2">{artist.bio}</p>
        )}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => onEdit(artist)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Edit ${artist.name}`}
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onDelete(artist)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={`Delete ${artist.name}`}
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            <span>Delete</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default ArtistCard;

