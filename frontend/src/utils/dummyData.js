// Dummy data for when backend is unavailable or empty

export const DUMMY_BINS = [
  { bin_id: 'BIN-101', name: 'Central Market #1', area_name: 'Gulmandi Market', lat: 19.8762, lon: 75.3433, fill_pct: 92, urgency: 'high', last_collected_hours: 48, status: 'pending' },
  { bin_id: 'BIN-102', name: 'Central Market #2', area_name: 'Gulmandi Market', lat: 19.8775, lon: 75.3421, fill_pct: 85, urgency: 'high', last_collected_hours: 36, status: 'pending' },
  { bin_id: 'BIN-201', name: 'Residential Zone A', area_name: 'Osmanpura', lat: 19.8690, lon: 75.3300, fill_pct: 45, urgency: 'medium', last_collected_hours: 12, status: 'pending' },
  { bin_id: 'BIN-202', name: 'Residential Zone B', area_name: 'Osmanpura', lat: 19.8710, lon: 75.3280, fill_pct: 60, urgency: 'medium', last_collected_hours: 24, status: 'pending' },
  { bin_id: 'BIN-301', name: 'Tech Park Entrance', area_name: 'CIDCO', lat: 19.8820, lon: 75.3580, fill_pct: 15, urgency: 'low', last_collected_hours: 6, status: 'pending' },
  { bin_id: 'BIN-302', name: 'Tech Park Cafeteria', area_name: 'CIDCO', lat: 19.8835, lon: 75.3565, fill_pct: 78, urgency: 'high', last_collected_hours: 24, status: 'pending' },
  { bin_id: 'BIN-401', name: 'Bus Stand North', area_name: 'Central', lat: 19.8750, lon: 75.3350, fill_pct: 98, urgency: 'critical', last_collected_hours: 72, status: 'pending' },
];

export const DUMMY_ROUTE = {
  route: [
    DUMMY_BINS[6], // BIN-401
    DUMMY_BINS[0], // BIN-101
    DUMMY_BINS[1], // BIN-102
    DUMMY_BINS[5], // BIN-302
  ],
  total_distance_km: 12.4,
  baseline_distance_km: 18.2,
  bins_visited: 4,
  bins_skipped: 3,
  fuel_saved_litres: 1.2,
  co2_saved_kg: 2.8,
  trees_equivalent: 0.5,
};

export const DUMMY_METRICS = {
  optimized_distance_km: 12.4,
  baseline_distance_km: 18.2,
  pct_distance_saved: 31.8,
  bins_visited: 4,
  bins_skipped: 3,
  fuel_saved_litres: 1.2,
  co2_saved_kg: 2.8,
  trees_equivalent: 0.5,
  model_rmse: 12.4,
  last_retrained: new Date().toISOString(),
  total_retrains: 14,
  model_accuracy_pct: 88.5,
  total_collections: 142,
};
