import { Card, CardBody, Typography, Chip, Button } from '@material-tailwind/react';
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
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardBody className="p-6">
        {artist.imageUrl?.url && (
          <img
            src={artist.imageUrl.url}
            alt={artist.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-start justify-between mb-2">
          <Typography variant="h5" color="blue-gray">
            {artist.name}
          </Typography>
          <Chip
            value={artist.status}
            color={statusColorMap[artist.status] || 'gray'}
            size="sm"
          />
        </div>
        {artist.genre && (
          <Typography variant="small" color="gray" className="mb-2">
            {artist.genre}
          </Typography>
        )}
        {artist.bio && (
          <Typography variant="paragraph" color="gray" className="mb-4 line-clamp-2">
            {artist.bio}
          </Typography>
        )}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            onClick={() => onEdit(artist)}
            className="flex items-center gap-1"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outlined"
            color="red"
            onClick={() => onDelete(artist)}
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

export default ArtistCard;

