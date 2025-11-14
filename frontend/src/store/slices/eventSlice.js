import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as eventService from '../../services/eventService';

/**
 * Async thunk to fetch events
 */
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

/**
 * Async thunk to fetch a single event
 */
export const fetchEvent = createAsyncThunk(
  'events/fetchEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvent(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch event');
    }
  }
);

/**
 * Async thunk to create an event
 */
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

/**
 * Async thunk to update an event
 */
export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await eventService.updateEvent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update event');
    }
  }
);

/**
 * Async thunk to delete an event
 */
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete event');
    }
  }
);

const initialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single event
    builder
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
      });

    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.selectedEvent?._id === action.payload._id) {
          state.selectedEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((e) => e._id !== action.payload);
        if (state.selectedEvent?._id === action.payload) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedEvent, clearSelectedEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;

