import multer from 'multer';
import { BadRequestError } from '../utils/errors.js';

/**
 * Configure multer for memory storage
 * Files are stored in memory before uploading to Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * File filter to validate image types
 */
const fileFilter = (req, file, cb) => {
  // Allowed image MIME types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
      ),
      false
    );
  }
};

/**
 * Multer configuration
 * - Max file size: 5MB
 * - Single file upload
 * - File validation enabled
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
});

/**
 * Middleware for single image upload
 * Field name: 'image'
 * File is optional - text fields will still be parsed
 */
export const uploadSingle = upload.single('image');

/**
 * Alternative: Use fields() to make file optional
 * This ensures text fields are always parsed
 */
export const uploadOptional = upload.fields([{ name: 'image', maxCount: 1 }]);

/**
 * Error handler for multer errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File size too large. Maximum size is 5MB.'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new BadRequestError('Unexpected file field.'));
    }
    return next(new BadRequestError(`Upload error: ${err.message}`));
  }
  next(err);
};

