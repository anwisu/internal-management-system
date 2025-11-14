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
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(eventData).forEach((key) => {
    if (key === 'image' && eventData[key] instanceof File) {
      formData.append('image', eventData[key]);
    } else if (key === 'artists' && Array.isArray(eventData[key])) {
      formData.append(key, JSON.stringify(eventData[key]));
    } else if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
      formData.append(key, eventData[key]);
    }
  });

  const response = await api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(eventData).forEach((key) => {
    if (key === 'image' && eventData[key] instanceof File) {
      formData.append('image', eventData[key]);
    } else if (key === 'artists' && Array.isArray(eventData[key])) {
      formData.append(key, JSON.stringify(eventData[key]));
    } else if (eventData[key] !== null && eventData[key] !== undefined && eventData[key] !== '') {
      formData.append(key, eventData[key]);
    }
  });

  const response = await api.put(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

