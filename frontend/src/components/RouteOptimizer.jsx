import { useState, useEffect } from 'react'

const RouteOptimizer = () => {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [stats, setStats] = useState({
    totalDistance: 0,
    estimatedTime: 0,
    fuelCost: 0,
    co2Emissions: 0
  })

  // Sample waste collection points
  const collectionPoints = [
    { id: 1, name: 'Downtown Area', lat: 40.7128, lng: -74.0060, waste: 85, priority: 'high' },
    { id: 2, name: 'Industrial Zone', lat: 40.7260, lng: -73.9897, waste: 92, priority: 'high' },
    { id: 3, name: 'Residential North', lat: 40.7580, lng: -73.9855, waste: 67, priority: 'medium' },
    { id: 4, name: 'Commercial District', lat: 40.7489, lng: -73.9680, waste: 78, priority: 'medium' },
    { id: 5, name: 'Suburban East', lat: 40.7282, lng: -73.9942, waste: 45, priority: 'low' },
    { id: 6, name: 'Tech Park', lat: 40.7614, lng: -73.9776, waste: 88, priority: 'high' }
  ]

  useEffect(() => {
    // Initialize with default route
    generateOptimizedRoute()
  }, [])

  const generateOptimizedRoute = async () => {
    setIsOptimizing(true)
    
    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simple route optimization algorithm (nearest neighbor)
    const optimized = [...collectionPoints].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      return (priorityWeight[b.priority] * b.waste) - (priorityWeight[a.priority] * a.waste)
    })
    
    setRoutes(optimized)
    
    // Calculate stats
    const totalDistance = calculateTotalDistance(optimized)
    const estimatedTime = Math.round(totalDistance * 2) // 2 min per km
    const fuelCost = (totalDistance * 0.8).toFixed(2) // $0.8 per km
    const co2Emissions = (totalDistance * 2.3).toFixed(1) // 2.3 kg CO2 per km
    
    setStats({
      totalDistance: totalDistance.toFixed(1),
      estimatedTime,
      fuelCost,
      co2Emissions
    })
    
    setIsOptimizing(false)
  }

  const calculateTotalDistance = (points) => {
    let distance = 0
    for (let i = 0; i < points.length - 1; i++) {
      distance += calculateDistance(points[i], points[i + 1])
    }
    return distance
  }

  const calculateDistance = (point1, point2) => {
    // Simplified distance calculation
    const latDiff = point1.lat - point2.lat
    const lngDiff = point1.lng - point2.lng
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 // Convert to km
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-green-500/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Live Route Optimizer</h3>
        <button
          onClick={generateOptimizedRoute}
          disabled={isOptimizing}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isOptimizing ? '🔄 Optimizing...' : '🚀 Optimize Routes'}
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-effect rounded-lg p-3 card-hover border border-green-500/20">
          <div className="text-green-500 text-sm font-medium">Distance</div>
          <div className="text-white text-xl font-bold">{stats.totalDistance} km</div>
        </div>
        <div className="glass-effect rounded-lg p-3 card-hover border border-green-500/20">
          <div className="text-green-500 text-sm font-medium">Est. Time</div>
          <div className="text-white text-xl font-bold">{stats.estimatedTime} min</div>
        </div>
        <div className="glass-effect rounded-lg p-3 card-hover border border-green-500/20">
          <div className="text-green-500 text-sm font-medium">Fuel Cost</div>
          <div className="text-white text-xl font-bold">${stats.fuelCost}</div>
        </div>
        <div className="glass-effect rounded-lg p-3 card-hover border border-green-500/20">
          <div className="text-green-500 text-sm font-medium">CO₂ Emissions</div>
          <div className="text-white text-xl font-bold">{stats.co2Emissions} kg</div>
        </div>
      </div>

      {/* Route List */}
      <div className="space-y-3">
        <h4 className="text-white font-medium mb-4">Optimized Collection Route</h4>
        {routes.map((point, index) => (
          <div
            key={point.id}
            className="glass-effect rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer card-hover border border-green-500/20"
            onClick={() => setSelectedRoute(point)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center text-green-500 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="text-white font-medium">{point.name}</div>
                  <div className="text-gray-400 text-sm">Waste Level: {point.waste}%</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(point.priority)}`}></div>
                <span className="text-gray-400 text-sm capitalize">{point.priority}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Point Details */}
      {selectedRoute && (
        <div className="mt-6 glass-effect rounded-lg p-4 border border-green-500/20">
          <h4 className="text-white font-medium mb-3">Location Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Location:</span>
              <span className="text-white ml-2">{selectedRoute.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Coordinates:</span>
              <span className="text-white ml-2">{selectedRoute.lat.toFixed(4)}, {selectedRoute.lng.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-400">Waste Level:</span>
              <span className="text-white ml-2">{selectedRoute.waste}%</span>
            </div>
            <div>
              <span className="text-gray-400">Priority:</span>
              <span className="text-white ml-2 capitalize">{selectedRoute.priority}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteOptimizer
