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
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(artistData).forEach((key) => {
    if (key === 'image' && artistData[key] instanceof File) {
      formData.append('image', artistData[key]);
    } else if (key === 'socialMedia') {
      formData.append(key, JSON.stringify(artistData[key]));
    } else if (artistData[key] !== null && artistData[key] !== undefined && artistData[key] !== '') {
      formData.append(key, artistData[key]);
    }
  });

  const response = await api.post('/artists', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateArtist = async (id, artistData) => {
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(artistData).forEach((key) => {
    if (key === 'image' && artistData[key] instanceof File) {
      formData.append('image', artistData[key]);
    } else if (key === 'socialMedia') {
      formData.append(key, JSON.stringify(artistData[key]));
    } else if (artistData[key] !== null && artistData[key] !== undefined && artistData[key] !== '') {
      formData.append(key, artistData[key]);
    }
  });

  const response = await api.put(`/artists/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteArtist = async (id) => {
  const response = await api.delete(`/artists/${id}`);
  return response.data;
};

