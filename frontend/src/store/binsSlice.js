import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { DUMMY_BINS } from '../utils/dummyData';

export const fetchAllBins = createAsyncThunk('bins/fetchAll', async () => {
  try {
    const { data } = await api.get('/bins');
    return data && data.length > 0 ? data : DUMMY_BINS;
  } catch (err) {
    console.warn('Backend unavailable, using dummy bins.');
    return DUMMY_BINS;
  }
});

export const runSimulation = createAsyncThunk('bins/simulate', async (scenario = 'random') => {
  try {
    const { data } = await api.post('/simulate', { scenario });
    return data && data.length > 0 ? data : DUMMY_BINS;
  } catch (err) {
    console.warn('Simulation failed, using dummy bins.');
    // Randomize dummy data a bit for effect
    return DUMMY_BINS.map(b => ({...b, fill_pct: Math.floor(Math.random() * 100), urgency: Math.random() > 0.5 ? 'high' : 'medium'}));
  }
});

const binsSlice = createSlice({
  name: 'bins',
  initialState: {
    bins: [],
    loading: false,
    lastUpdated: null,
    error: null,
  },
  reducers: {
    updateBinLocally: (state, action) => {
      const index = state.bins.findIndex(b => b.bin_id === action.payload.bin_id);
      if (index !== -1) {
        state.bins[index] = { ...state.bins[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBins.pending, (state) => { state.loading = true; })
      .addCase(fetchAllBins.fulfilled, (state, action) => {
        state.loading = false;
        state.bins = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllBins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(runSimulation.pending, (state) => { state.loading = true; })
      .addCase(runSimulation.fulfilled, (state, action) => {
        state.loading = false;
        state.bins = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(runSimulation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateBinLocally } = binsSlice.actions;

// Selectors matching backend keys
export const selectCriticalCount = (state) => 
  (state.bins.bins || []).filter(b => b.urgency?.toLowerCase() === "high").length;

export const selectMediumCount = (state) => 
  (state.bins.bins || []).filter(b => b.urgency?.toLowerCase() === "medium").length;

export const selectAllBins = (state) => state.bins.bins || [];

export default binsSlice.reducer;
