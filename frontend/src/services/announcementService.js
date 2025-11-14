import api from './api.js';

/**
 * Announcement service - handles all announcement-related API calls
 */

export const getAnnouncements = async (params = {}) => {
  const response = await api.get('/announcements', { params });
  return response.data;
};

export const getAnnouncement = async (id) => {
  const response = await api.get(`/announcements/${id}`);
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(`/announcements/${id}`, announcementData);
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

export const getActiveAnnouncements = async () => {
  const response = await api.get('/announcements/active');
  return response.data;
};

