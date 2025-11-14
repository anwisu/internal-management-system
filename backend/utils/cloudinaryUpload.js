import cloudinary from '../config/cloudinary.js';
import { BadRequestError } from './errors.js';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder path (e.g., 'artists', 'events')
 * @param {String} resourceType - Resource type ('image' by default)
 * @returns {Promise<{public_id: String, url: String}>}
 */
export const uploadToCloudinary = async (fileBuffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new BadRequestError('No file provided'));
    }

    const uploadOptions = {
      folder: `internal-management/${folder}`,
      resource_type: resourceType,
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(
            new BadRequestError('Failed to upload image to cloud storage')
          );
        }

        if (!result || !result.public_id || !result.secure_url) {
          return reject(new BadRequestError('Invalid response from cloud storage'));
        }

        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error - deletion failure shouldn't break the flow
  }
};

/**
 * Delete old image if a new one is being uploaded
 * @param {Object} oldImageUrl - Old image object with public_id
 * @returns {Promise<void>}
 */
export const deleteOldImage = async (oldImageUrl) => {
  if (oldImageUrl && oldImageUrl.public_id) {
    await deleteFromCloudinary(oldImageUrl.public_id);
  }
};

