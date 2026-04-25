import { useState, useEffect } from 'react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('today')
  const [analytics, setAnalytics] = useState({
    collections: 0,
    efficiency: 0,
    fuelSaved: 0,
    timeSaved: 0,
    co2Reduced: 0,
    routesCompleted: 0
  })

  useEffect(() => {
    // Simulate analytics data loading
    const loadAnalytics = () => {
      const multiplier = timeRange === 'today' ? 1 : timeRange === 'week' ? 7 : 30
      setAnalytics({
        collections: Math.floor(Math.random() * 50 + 20) * multiplier,
        efficiency: Math.floor(Math.random() * 20 + 75),
        fuelSaved: (Math.random() * 100 + 50) * multiplier,
        timeSaved: Math.floor(Math.random() * 200 + 100) * multiplier,
        co2Reduced: (Math.random() * 500 + 200) * multiplier,
        routesCompleted: Math.floor(Math.random() * 10 + 5) * multiplier
      })
    }

    loadAnalytics()
    const interval = setInterval(loadAnalytics, 5000)
    return () => clearInterval(interval)
  }, [timeRange])

  const chartData = [
    { label: 'Mon', value: Math.random() * 100, day: 'Monday' },
    { label: 'Tue', value: Math.random() * 100, day: 'Tuesday' },
    { label: 'Wed', value: Math.random() * 100, day: 'Wednesday' },
    { label: 'Thu', value: Math.random() * 100, day: 'Thursday' },
    { label: 'Fri', value: Math.random() * 100, day: 'Friday' },
    { label: 'Sat', value: Math.random() * 100, day: 'Saturday' },
    { label: 'Sun', value: Math.random() * 100, day: 'Sunday' }
  ]

  return (
    <div className="glass-effect rounded-2xl p-8 card-hover border border-green-500/20 shadow-2xl">
      {/* Header with animation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full animate-pulse-slow"></div>
          <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="glass-effect text-white px-4 py-2 rounded-lg border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Key Metrics with premium styling */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 text-sm font-medium">Collections</span>
            <span className="text-green-500 text-xs bg-green-500/20 px-2 py-1 rounded-full animate-pulse-slow">+12%</span>
          </div>
          <div className="text-white text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">{analytics.collections}</div>
          <div className="text-gray-400 text-sm">Waste collections completed</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 text-sm font-medium">Efficiency</span>
            <span className="text-green-500 text-xs bg-green-500/20 px-2 py-1 rounded-full animate-pulse-slow">+8%</span>
          </div>
          <div className="text-white text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">{analytics.efficiency}%</div>
          <div className="text-gray-400 text-sm">Route optimization score</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 text-sm font-medium">Routes</span>
            <span className="text-green-500 text-xs bg-green-500/20 px-2 py-1 rounded-full animate-pulse-slow">+15%</span>
          </div>
          <div className="text-white text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">{analytics.routesCompleted}</div>
          <div className="text-gray-400 text-sm">Successfully completed</div>
        </div>
      </div>

      {/* Environmental Impact with premium cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-full"></div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              ⛽
            </div>
            <span className="text-gray-300 font-medium">Fuel Saved</span>
          </div>
          <div className="text-white text-2xl font-bold group-hover:scale-105 transition-transform">{analytics.fuelSaved.toFixed(1)}L</div>
          <div className="text-amber-500 text-xs mt-1">≈ ${(analytics.fuelSaved * 1.5).toFixed(0)} saved</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              ⏰
            </div>
            <span className="text-gray-300 font-medium">Time Saved</span>
          </div>
          <div className="text-white text-2xl font-bold group-hover:scale-105 transition-transform">{analytics.timeSaved} min</div>
          <div className="text-blue-500 text-xs mt-1">≈ {(analytics.timeSaved / 60).toFixed(1)} hours</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-hover border border-green-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              🌱
            </div>
            <span className="text-gray-300 font-medium">CO₂ Reduced</span>
          </div>
          <div className="text-white text-2xl font-bold group-hover:scale-105 transition-transform">{analytics.co2Reduced.toFixed(1)} kg</div>
          <div className="text-green-500 text-xs mt-1">≈ {(analytics.co2Reduced / 1000).toFixed(2)} tons</div>
        </div>
      </div>

      {/* Enhanced Performance Chart */}
      <div className="glass-effect rounded-2xl p-6 border border-green-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/5 to-transparent rounded-bl-full"></div>
        <h4 className="text-lg font-medium text-white mb-6 flex items-center">
          <span className="w-2 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          Weekly Performance
        </h4>
        <div className="flex items-end justify-between h-44">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full bg-gray-600/20 rounded-t relative h-full">
                <div
                  className="bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-t transition-all duration-700 hover:from-green-500 hover:via-green-400 hover:to-green-300 group-hover:scale-105 origin-bottom"
                  style={{ height: `${data.value}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.value.toFixed(0)}%
                  </div>
                </div>
              </div>
              <span className="text-gray-400 text-sm mt-3 group-hover:text-white transition-colors">{data.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Recent Activity */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-white mb-6 flex items-center">
          <span className="w-2 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></span>
          Recent Activity
        </h4>
        <div className="space-y-3">
          {[
            { action: 'Route optimized', location: 'Downtown Area', time: '2 min ago', status: 'success', icon: '🚀', detail: 'Saved 15% fuel' },
            { action: 'Collection completed', location: 'Industrial Zone', time: '5 min ago', status: 'success', icon: '✅', detail: '2.5 tons collected' },
            { action: 'Fuel alert', location: 'Truck Alpha', time: '12 min ago', status: 'warning', icon: '⚠️', detail: 'Refuel required' },
            { action: 'New route assigned', location: 'Residential North', time: '15 min ago', status: 'info', icon: '📍', detail: '8 stops added' }
          ].map((activity, index) => (
            <div key={index} className="glass-effect rounded-2xl p-4 flex items-center justify-between card-hover border border-green-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/5 to-transparent rounded-bl-full"></div>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform ${
                  activity.status === 'success' ? 'bg-green-500/20 text-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {activity.icon}
                </div>
                <div>
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-gray-400 text-sm">{activity.location}</div>
                  <div className="text-gray-500 text-xs mt-1">{activity.detail}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-sm">{activity.time}</span>
                <div className={`w-2 h-2 rounded-full ml-auto mt-1 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer with live indicator */}
      <div className="mt-8 pt-6 border-t border-gray-700/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">Live data updating every 5 seconds</span>
        </div>
        <div className="text-gray-500 text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default Analytics
