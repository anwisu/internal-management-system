import api from './api.js';

/**
 * Artist service - handles all artist-related API calls
 */

export const getArtists = async (params = {}) => {
  const response = await api.get('/artists', { params });
  return response.data;
};

export const getArtist = async (id) => {
  const response = await api.get(`/artists/${id}`);
  return response.data;
};

export const createArtist = async (artistData) => {
  const response = await api.post('/artists', artistData);
  return response.data;
};

export const updateArtist = async (id, artistData) => {
  const response = await api.put(`/artists/${id}`, artistData);
  return response.data;
};

export const deleteArtist = async (id) => {
  const response = await api.delete(`/artists/${id}`);
  return response.data;
};

/**
 * Upload image for artist
 */
export const uploadArtistImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await api.post(`/artists/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get artist image
 */
export const getArtistImage = async (id) => {
  const response = await api.get(`/artists/${id}/image`);
  return response.data;
};

/**
 * Delete artist image
 */
export const deleteArtistImage = async (id) => {
  const response = await api.delete(`/artists/${id}/image`);
  return response.data;
};

