import { useState, useEffect } from 'react'

const LiveMap = () => {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  useEffect(() => {
    // Initialize vehicles
    const initialVehicles = [
      { id: 1, name: 'Truck Alpha', lat: 40.7128, lng: -74.0060, status: 'active', fuel: 75, route: 'Downtown Loop' },
      { id: 2, name: 'Truck Beta', lat: 40.7260, lng: -73.9897, status: 'active', fuel: 82, route: 'Industrial Route' },
      { id: 3, name: 'Truck Gamma', lat: 40.7580, lng: -73.9855, status: 'maintenance', fuel: 45, route: 'Residential North' }
    ]
    setVehicles(initialVehicles)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
        lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        fuel: Math.max(0, vehicle.fuel - Math.random() * 0.5)
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'maintenance': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getFuelColor = (fuel) => {
    if (fuel > 60) return 'text-green-500'
    if (fuel > 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Live Fleet Tracking</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-sm">Live</span>
        </div>
      </div>

      {/* Map Simulation */}
      <div className="bg-gray-700/30 rounded-lg p-8 mb-6 relative h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div>Interactive Map View</div>
            <div className="text-sm mt-2">Real-time vehicle positions</div>
          </div>
        </div>
        
        {/* Simulated vehicle positions */}
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse cursor-pointer"
            style={{
              top: `${20 + (vehicle.lat - 40.7) * 1000}%`,
              left: `${20 + (vehicle.lng + 74) * 1000}%`
            }}
            onClick={() => setSelectedVehicle(vehicle)}
          />
        ))}
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        <h4 className="text-white font-medium mb-3">Fleet Status</h4>
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className={`bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all cursor-pointer ${
              selectedVehicle?.id === vehicle.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center text-green-500">
                  🚛
                </div>
                <div>
                  <div className="text-white font-medium">{vehicle.name}</div>
                  <div className="text-gray-400 text-sm">{vehicle.route}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                  <span className="text-gray-400 text-sm capitalize">{vehicle.status}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getFuelColor(vehicle.fuel)}`}>
                    {vehicle.fuel.toFixed(1)}%
                  </div>
                  <div className="text-gray-500 text-xs">Fuel</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Vehicle Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Vehicle:</span>
              <span className="text-white ml-2">{selectedVehicle.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="text-white ml-2 capitalize">{selectedVehicle.status}</span>
            </div>
            <div>
              <span className="text-gray-400">Position:</span>
              <span className="text-white ml-2">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-400">Fuel Level:</span>
              <span className={`ml-2 font-medium ${getFuelColor(selectedVehicle.fuel)}`}>
                {selectedVehicle.fuel.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">Current Route:</span>
              <span className="text-white ml-2">{selectedVehicle.route}</span>
            </div>
            <div>
              <span className="text-gray-400">Last Update:</span>
              <span className="text-white ml-2">Just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveMap
