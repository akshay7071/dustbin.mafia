import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchAllBins = createAsyncThunk('bins/fetchAll', async () => {
  const { data } = await api.get('/api/bins');
  return data.bins;
});

export const fetchPredictions = createAsyncThunk('bins/predict', async () => {
  const { data } = await api.post('/api/predict');
  return data.predictions;
});

const binsSlice = createSlice({
  name: 'bins',
  initialState: {
    bins: [],
    predictions: [],
    loading: false,
    lastPredicted: null,
    error: null,
  },
  reducers: {
    updateBinStatus: (state, { payload }) => {
      const { bin_id, status } = payload;
      const bin = state.predictions.find(b => b.bin_id === bin_id);
      if (bin && status === 'collected') {
        bin.urgency = 'LOW';
        bin.predicted_fill = 0;
      }
    },
    setPredictionFromSocket: (state, action) => {
      state.predictions = action.payload.predictions || action.payload;
      state.lastPredicted = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBins.pending, (state) => { state.loading = true; })
      .addCase(fetchAllBins.fulfilled, (state, action) => {
        state.loading = false;
        state.bins = action.payload;
      })
      .addCase(fetchAllBins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPredictions.pending, (state) => { state.loading = true; })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload;
        state.lastPredicted = new Date().toISOString();
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateBinStatus, setPredictionFromSocket } = binsSlice.actions;

export const selectCriticalCount = (state) => state.bins.predictions.filter(b => b.urgency === "CRITICAL").length;
export const selectHighCount = (state) => state.bins.predictions.filter(b => b.urgency === "HIGH").length;
export const selectAllPredictions = (state) => state.bins.predictions;

export default binsSlice.reducer;
