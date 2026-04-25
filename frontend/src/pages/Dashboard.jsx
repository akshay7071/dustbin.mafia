import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBins, fetchPredictions } from '../store/binsSlice';
import BinMap from '../components/BinMap';
import RoutePanel from '../components/RoutePanel';
import StatsBar from '../components/StatsBar';
import { socket } from '../socket';
import { updateBinStatus, setPredictionFromSocket } from '../store/binsSlice';
import { setRouteFromSocket } from '../store/routeSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { predictions } = useSelector(state => state.bins);
  const { route } = useSelector(state => state.route);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchAllBins());
    // Auto-run prediction on load for demo
    dispatch(fetchPredictions());

    // Socket subscriptions
    socket.on('bin_status_change', (data) => dispatch(updateBinStatus(data)));
    socket.on('prediction_ready', (data) => dispatch(setPredictionFromSocket(data)));
    socket.on('route_ready', (data) => dispatch(setRouteFromSocket(data)));

    return () => {
      socket.off('bin_status_change');
      socket.off('prediction_ready');
      socket.off('route_ready');
    };
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
