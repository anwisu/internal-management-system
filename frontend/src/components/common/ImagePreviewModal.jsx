import { Dialog, DialogHeader, DialogBody, Button } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Image Preview Modal component
 * Displays a full-size image preview
 */
function ImagePreviewModal({ open, onClose, imageUrl, title = 'Image Preview' }) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} handler={onClose} size="xl" className="p-0">
      <DialogHeader className="flex items-center justify-between">
        <span>{title}</span>
        <Button
          variant="text"
          color="blue-gray"
          className="!absolute top-4 right-4"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>
      <DialogBody className="p-0">
        <div className="relative w-full h-auto max-h-[80vh] overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default ImagePreviewModal;

