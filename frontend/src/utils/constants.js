/**
 * Application constants
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const STATUS_OPTIONS = {
  ARTIST: ['active', 'inactive', 'pending'],
  EVENT: ['upcoming', 'ongoing', 'completed', 'cancelled'],
  ANNOUNCEMENT_PRIORITY: ['low', 'medium', 'high'],
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';

