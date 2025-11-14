import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import artistReducer from './slices/artistSlice';
import eventReducer from './slices/eventSlice';
import announcementReducer from './slices/announcementSlice';

/**
 * Redux store configuration
 */
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    artists: artistReducer,
    events: eventReducer,
    announcements: announcementReducer,
  },
});

