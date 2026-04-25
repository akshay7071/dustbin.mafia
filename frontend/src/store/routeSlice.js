import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { DUMMY_ROUTE } from '../utils/dummyData';

export const optimizeRoute = createAsyncThunk('route/optimize', async () => {
  try {
    const { data } = await api.post('/route');
    return data && data.route && data.route.length > 0 ? data : DUMMY_ROUTE;
  } catch (err) {
    console.warn('Backend unavailable, using dummy route.');
    return DUMMY_ROUTE;
  }
});

export const dispatchRoute = createAsyncThunk('route/dispatch', async ({ driver_phone, route_id }) => {
  const { data } = await api.post('/dispatch', { driver_phone, route_id });
  return data;
});

const routeSlice = createSlice({
  name: 'route',
  initialState: {
    route: [],
    stats: {},
    routeId: null,
    dispatched: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearRoute: (state) => {
      state.route = [];
      state.stats = {};
      state.routeId = null;
      state.dispatched = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimizeRoute.pending, (state) => { state.loading = true; })
      .addCase(optimizeRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.route = action.payload.route || [];
        state.stats = {
          total_distance_km: action.payload.total_distance_km,
          baseline_distance_km: action.payload.baseline_distance_km,
          bins_visited: action.payload.bins_visited,
          bins_skipped: action.payload.bins_skipped,
          fuel_saved_litres: action.payload.fuel_saved_litres,
          co2_saved_kg: action.payload.co2_saved_kg,
          trees_equivalent: action.payload.trees_equivalent,
        };
        state.routeId = action.payload.routeId || null;
        state.dispatched = false;
      })
      .addCase(optimizeRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(dispatchRoute.pending, (state) => { state.loading = true; })
      .addCase(dispatchRoute.fulfilled, (state) => {
        state.loading = false;
        state.dispatched = true;
      })
      .addCase(dispatchRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearRoute } = routeSlice.actions;

export default routeSlice.reducer;
