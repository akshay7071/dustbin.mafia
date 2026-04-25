import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBins, fetchPredictions } from '../store/binsSlice';
import BinMap from '../components/BinMap';
import RoutePanel from '../components/RoutePanel';
import StatsBar from '../components/StatsBar';
export default function Dashboard() {
  const dispatch = useDispatch();
  const { predictions } = useSelector(state => state.bins);
  const { route } = useSelector(state => state.route);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchAllBins());
    dispatch(fetchPredictions());

    // Polling every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchAllBins());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <StatsBar />
        <BinMap predictions={predictions} route={route} />
      </div>
      <RoutePanel />
    </div>
  );
}
