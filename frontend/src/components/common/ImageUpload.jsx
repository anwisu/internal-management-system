import { useState, useEffect, useRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Typography } from '@material-tailwind/react';
import { useToast } from '../../context/ToastContext';
import { API_BASE_URL } from '../../utils/constants';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

/**
 * ImageUpload component
 * Handles image upload with FilePond, including drag-and-drop, preview, and progress
 */
function ImageUpload({
  entityId,
  entityType, // 'artist' or 'event'
  currentImageUrl = null,
  onUploadSuccess,
  onDeleteSuccess,
  onError,
  disabled = false,
  className = '',
}) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pondRef = useRef(null);
  const { success, error: showError } = useToast();

  // Set initial file if currentImageUrl exists
  useEffect(() => {
    if (currentImageUrl && files.length === 0 && entityId) {
      setFiles([
        {
          source: currentImageUrl,
          options: {
            type: 'local',
            file: {
              name: 'current-image',
              size: 0,
              type: 'image/*',
            },
          },
        },
      ]);
    } else if (!currentImageUrl && files.length > 0) {
      // Clear files if imageUrl is removed
      setFiles([]);
    }
  }, [currentImageUrl, entityId]);

  const handleFileAdd = async (error, file) => {
    if (error) {
      showError(error.message || 'Failed to add file');
      return;
    }

    // If no entityId, just store the file for later upload
    if (!entityId) {
      // File will be stored and uploaded after entity creation
      // Call onUploadSuccess with the file object so parent can handle it
      // FilePond file object has a .file property containing the actual File
      if (onUploadSuccess) {
        onUploadSuccess(null, file);
      }
      // Don't remove the file, let it stay in the preview
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file.file);

      const response = await fetch(
        `${API_BASE_URL}/${entityType}s/${entityId}/image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      // Update file source to the uploaded image URL
      file.setMetadata('serverId', data.data.imageUrl);
      
      success('Image uploaded successfully');
      
      if (onUploadSuccess) {
        onUploadSuccess(data.data.imageUrl, data.data[entityType]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload image';
      showError(errorMessage);
      pondRef.current?.removeFile(file);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = async (error, file) => {
    if (error) {
      showError(error.message || 'Failed to remove file');
      return;
    }

    // If file has serverId, it means it was uploaded to the server
    const serverId = file.getMetadata('serverId');
    const isServerFile = serverId || (file.source && file.source.startsWith('http'));

    if (isServerFile && entityId) {
      // Delete from server
      setIsDeleting(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/${entityType}s/${entityId}/image`,
          {
            method: 'DELETE',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Delete failed');
        }

        success('Image deleted successfully');
        
        if (onDeleteSuccess) {
          onDeleteSuccess(data.data[entityType]);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete image';
        showError(errorMessage);
        // Re-add the file since deletion failed
        setFiles([file]);
        if (onError) {
          onError(err);
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFileRevert = async (fileId, load, error) => {
    // Handle file revert if needed
    if (error) {
      showError('Failed to revert file');
      return;
    }
    load();
  };

  return (
    <div className={`w-full ${className}`}>
      <Typography variant="small" className="mb-2 text-gray-700">
        Image
      </Typography>
      <FilePond
        ref={pondRef}
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        onaddfile={handleFileAdd}
        onremovefile={handleFileRemove}
        onrevert={handleFileRevert}
        labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
        labelFileProcessing="Uploading..."
        labelFileProcessingComplete="Upload complete"
        labelFileProcessingError="Upload error"
        labelFileRemove="Remove"
        labelTapToCancel="tap to cancel"
        labelTapToRetry="tap to retry"
        labelTapToUndo="tap to undo"
        acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']}
        maxFileSize="5MB"
        imagePreviewHeight={200}
        imageCropAspectRatio="1:1"
        imageResizeTargetWidth={1200}
        imageResizeTargetHeight={1200}
        imageResizeMode="cover"
        stylePanelLayout="integrated"
        styleButtonRemoveItemPosition="right"
        disabled={disabled || isUploading || isDeleting}
        allowRevert={!!entityId}
        className="filepond-custom"
      />
      <Typography variant="small" color="gray" className="mt-2">
        Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
      </Typography>
    </div>
  );
}

export default ImageUpload;

