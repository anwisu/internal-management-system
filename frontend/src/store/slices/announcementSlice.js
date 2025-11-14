import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as announcementService from '../../services/announcementService';

/**
 * Async thunk to fetch announcements
 */
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await announcementService.getAnnouncements(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch announcements');
    }
  }
);

/**
 * Async thunk to fetch a single announcement
 */
export const fetchAnnouncement = createAsyncThunk(
  'announcements/fetchAnnouncement',
  async (id, { rejectWithValue }) => {
    try {
      const response = await announcementService.getAnnouncement(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch announcement');
    }
  }
);

/**
 * Async thunk to create an announcement
 */
export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (announcementData, { rejectWithValue }) => {
    try {
      const response = await announcementService.createAnnouncement(announcementData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create announcement');
    }
  }
);

/**
 * Async thunk to update an announcement
 */
export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await announcementService.updateAnnouncement(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update announcement');
    }
  }
);

/**
 * Async thunk to delete an announcement
 */
export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id, { rejectWithValue }) => {
    try {
      await announcementService.deleteAnnouncement(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete announcement');
    }
  }
);

const initialState = {
  announcements: [],
  selectedAnnouncement: null,
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setSelectedAnnouncement: (state, action) => {
      state.selectedAnnouncement = action.payload;
    },
    clearSelectedAnnouncement: (state) => {
      state.selectedAnnouncement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch announcements
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single announcement
    builder
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        state.selectedAnnouncement = action.payload;
      });

    // Create announcement
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.push(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update announcement
    builder
      .addCase(updateAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.announcements.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
        if (state.selectedAnnouncement?._id === action.payload._id) {
          state.selectedAnnouncement = action.payload;
        }
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete announcement
    builder
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = state.announcements.filter((a) => a._id !== action.payload);
        if (state.selectedAnnouncement?._id === action.payload) {
          state.selectedAnnouncement = null;
        }
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedAnnouncement, clearSelectedAnnouncement, clearError } = announcementSlice.actions;
export default announcementSlice.reducer;

