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
  // Validate name before creating FormData
  if (!artistData.name || typeof artistData.name !== 'string' || artistData.name.trim() === '') {
    throw new Error('Name is required');
  }

  const formData = new FormData();
  
  // Debug: Log what we're sending
  console.log('=== FRONTEND: Creating artist ===');
  console.log('artistData:', { ...artistData, image: artistData.image instanceof File ? '[File]' : artistData.image });
  console.log('artistData.name:', artistData.name);
  console.log('artistData.name type:', typeof artistData.name);
  
  // Append name first (most important)
  formData.append('name', String(artistData.name).trim());
  console.log('Appended name to FormData:', formData.get('name'));
  
  // Append status
  if (artistData.status) {
    formData.append('status', String(artistData.status));
  }
  
  // Append other fields
  Object.keys(artistData).forEach((key) => {
    if (key === 'image' && artistData[key] instanceof File) {
      formData.append('image', artistData[key]);
      console.log('Appended image file');
    } else if (key === 'socialMedia') {
      formData.append(key, JSON.stringify(artistData[key]));
    } else if (key !== 'name' && key !== 'status' && key !== 'image') {
      // Append other fields if they have a value
      const value = artistData[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value.trim());
        } else if (typeof value !== 'string') {
          formData.append(key, value);
        }
      }
    }
  });

  // Verify name is in FormData
  const nameCheck = formData.get('name');
  console.log('Final FormData name check:', nameCheck);
  console.log('================================');

  // Don't set Content-Type manually - axios will set it with the correct boundary
  const response = await api.post('/artists', formData);
  return response.data;
};

export const updateArtist = async (id, artistData) => {
  // Validate name before creating FormData
  if (!artistData.name || typeof artistData.name !== 'string' || artistData.name.trim() === '') {
    throw new Error('Name is required');
  }

  const formData = new FormData();
  
  // Required fields that should always be sent
  const requiredFields = ['name', 'status'];
  
  // Append all fields to FormData in a specific order to ensure name is first
  // First, append required fields
  requiredFields.forEach((key) => {
    if (artistData.hasOwnProperty(key)) {
      const value = artistData[key];
      const stringValue = value !== null && value !== undefined ? String(value).trim() : '';
      formData.append(key, stringValue);
    }
  });
  
  // Then append other fields
  Object.keys(artistData).forEach((key) => {
    if (key === 'image' && artistData[key] instanceof File) {
      formData.append('image', artistData[key]);
    } else if (key === 'socialMedia') {
      formData.append(key, JSON.stringify(artistData[key]));
    } else if (!requiredFields.includes(key)) {
      // Append other fields if they have a value
      const value = artistData[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value.trim());
        } else if (typeof value !== 'string') {
          formData.append(key, value);
        }
      }
    }
  });

  // Don't set Content-Type manually - axios will set it with the correct boundary
  const response = await api.put(`/artists/${id}`, formData);
  return response.data;
};

export const deleteArtist = async (id) => {
  const response = await api.delete(`/artists/${id}`);
  return response.data;
};

