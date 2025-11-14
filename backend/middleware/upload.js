import multer from 'multer';
import { upload } from '../config/cloudinary.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Middleware to handle single image upload
 */
export const uploadSingle = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError('File size too large. Maximum size is 5MB.'));
          }
          return next(new BadRequestError(`Upload error: ${err.message}`));
        }
        // Handle other errors (e.g., file filter errors)
        return next(new BadRequestError(err.message || 'File upload failed'));
      }

      // Check if file was uploaded
      if (!req.file) {
        return next(new BadRequestError('No image file provided'));
      }

      next();
    });
  };
};

/**
 * Middleware to handle multiple image uploads (for future use)
 */
export const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);

    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError('File size too large. Maximum size is 5MB per file.'));
          }
          return next(new BadRequestError(`Upload error: ${err.message}`));
        }
        return next(new BadRequestError(err.message || 'File upload failed'));
      }

      if (!req.files || req.files.length === 0) {
        return next(new BadRequestError('No image files provided'));
      }

      next();
    });
  };
};

