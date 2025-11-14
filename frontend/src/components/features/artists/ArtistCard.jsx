import { useState } from 'react';
import { Card, CardBody, Typography, Chip, Button } from '@material-tailwind/react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import ImagePreviewModal from '../../common/ImagePreviewModal';

/**
 * Artist Card component
 * Displays artist information in a card format
 */
function ArtistCard({ artist, onEdit, onDelete }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const statusColorMap = {
    active: 'green',
    inactive: 'gray',
    pending: 'amber',
  };

  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardBody className="p-6">
          {artist.imageUrl && (
            <div className="relative group mb-4">
              <img
                src={artist.imageUrl}
                alt={artist.name}
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
    <ImagePreviewModal
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      imageUrl={artist.imageUrl}
      title={artist.name}
    />
    </>
  );
}

export default ArtistCard;

