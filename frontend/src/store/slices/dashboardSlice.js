import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardService from '../../services/dashboardService';
import * as eventService from '../../services/eventService';
import * as announcementService from '../../services/announcementService';

/**
 * Async thunk to fetch dashboard statistics
 */
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

/**
 * Async thunk to fetch upcoming events
 */
export const fetchUpcomingEvents = createAsyncThunk(
  'dashboard/fetchUpcomingEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getUpcomingEvents();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming events');
    }
  }
);

/**
 * Async thunk to fetch active announcements
 */
export const fetchActiveAnnouncements = createAsyncThunk(
  'dashboard/fetchActiveAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await announcementService.getActiveAnnouncements();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch active announcements');
    }
  }
);

const initialState = {
  stats: null,
  upcomingEvents: [],
  activeAnnouncements: [],
  loading: {
    stats: false,
    events: false,
    announcements: false,
  },
  error: {
    stats: null,
    events: null,
    announcements: null,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        stats: null,
        events: null,
        announcements: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload;
      });

    // Upcoming events
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading.events = true;
        state.error.events = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading.events = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading.events = false;
        state.error.events = action.payload;
      });

    // Active announcements
    builder
      .addCase(fetchActiveAnnouncements.pending, (state) => {
        state.loading.announcements = true;
        state.error.announcements = null;
      })
      .addCase(fetchActiveAnnouncements.fulfilled, (state, action) => {
        state.loading.announcements = false;
        state.activeAnnouncements = action.payload;
      })
      .addCase(fetchActiveAnnouncements.rejected, (state, action) => {
        state.loading.announcements = false;
        state.error.announcements = action.payload;
      });
  },
});

export const { clearErrors } = dashboardSlice.actions;
export default dashboardSlice.reducer;

