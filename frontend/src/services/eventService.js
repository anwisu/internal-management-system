import api from './api.js';

/**
 * Event service - handles all event-related API calls
 */

export const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const getUpcomingEvents = async () => {
  const response = await api.get('/events/upcoming');
  return response.data;
};

/**
 * Upload image for event
 */
export const uploadEventImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await api.post(`/events/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get event image
 */
export const getEventImage = async (id) => {
  const response = await api.get(`/events/${id}/image`);
  return response.data;
};

/**
 * Delete event image
 */
export const deleteEventImage = async (id) => {
  const response = await api.delete(`/events/${id}/image`);
  return response.data;
};

