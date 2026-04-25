import { configureStore } from '@reduxjs/toolkit';
import binsReducer from './binsSlice';
import routeReducer from './routeSlice';

export const store = configureStore({
  reducer: {
    bins: binsReducer,
    route: routeReducer,
  },
});
