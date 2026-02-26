import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as artistService from '../../services/artistService';

/**
 * Async thunk to fetch artists
 */
export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await artistService.getArtists(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch artists');
    }
  }
);

/**
 * Async thunk to fetch a single artist
 */
export const fetchArtist = createAsyncThunk(
  'artists/fetchArtist',
  async (id, { rejectWithValue }) => {
    try {
      const response = await artistService.getArtist(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch artist');
    }
  }
);

/**
 * Async thunk to create an artist
 */
export const createArtist = createAsyncThunk(
  'artists/createArtist',
  async (artistData, { rejectWithValue }) => {
    try {
      const response = await artistService.createArtist(artistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create artist');
    }
  }
);

/**
 * Async thunk to update an artist
 */
export const updateArtist = createAsyncThunk(
  'artists/updateArtist',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await artistService.updateArtist(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update artist');
    }
  }
);

/**
 * Async thunk to delete an artist
 */
export const deleteArtist = createAsyncThunk(
  'artists/deleteArtist',
  async (id, { rejectWithValue }) => {
    try {
      await artistService.deleteArtist(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete artist');
    }
  }
);

const initialState = {
  artists: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  selectedArtist: null,
  loading: false,
  error: null,
};

const artistSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setSelectedArtist: (state, action) => {
      state.selectedArtist = action.payload;
    },
    clearSelectedArtist: (state) => {
      state.selectedArtist = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch artists
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload.data || action.payload; // Fallback for components that might pass only data directly
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single artist
    builder
      .addCase(fetchArtist.fulfilled, (state, action) => {
        state.selectedArtist = action.payload;
      });

    // Create artist
    builder
      .addCase(createArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.artists.push(action.payload);
      })
      .addCase(createArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update artist
    builder
      .addCase(updateArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.artists.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.artists[index] = action.payload;
        }
        if (state.selectedArtist?._id === action.payload._id) {
          state.selectedArtist = action.payload;
        }
      })
      .addCase(updateArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete artist
    builder
      .addCase(deleteArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = state.artists.filter((a) => a._id !== action.payload);
        if (state.selectedArtist?._id === action.payload) {
          state.selectedArtist = null;
        }
      })
      .addCase(deleteArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedArtist, clearSelectedArtist, clearError } = artistSlice.actions;
export default artistSlice.reducer;

