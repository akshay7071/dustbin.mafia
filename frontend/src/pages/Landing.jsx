import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Route as RouteIcon, Send, Leaf, ArrowRight, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-accent blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Stop Wasting Fuel on <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">Empty Bins</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            AI-powered waste collection for Chhatrapati Sambhajinagar — 278 bins, 34 zones, zero overflow. Demand-driven routing that saves your city money.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/dashboard" 
              className="bg-accent hover:bg-accent-hover text-white font-semibold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center w-full sm:w-auto justify-center"
            >
              <span>Operator Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              to="/public" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold py-3.5 px-8 rounded-full transition-colors flex items-center w-full sm:w-auto justify-center"
            >
              <Leaf className="w-5 h-5 mr-2" />
              <span>Public Stats</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-20 -mt-6 mx-6 md:mx-auto max-w-5xl rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 text-center">
            <div className="text-3xl font-extrabold text-primary mb-1">56%</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Fewer km driven</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-extrabold text-accent mb-1">₹258</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Saved per run</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-extrabold text-low mb-1">6.3 kg</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">CO₂ avoided per run</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our intelligent system replaces fixed schedules with real-time demand prediction and dynamic routing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<BrainCircuit className="w-8 h-8 text-primary" />}
            title="AI Fill Prediction"
            description="Our Random Forest ML model analyzes zone types, historical data, and time to predict which bins need collection NOW."
            color="bg-green-50 border-green-100"
          />
          <FeatureCard 
            icon={<RouteIcon className="w-8 h-8 text-accent" />}
            title="Route Optimizer"
            description="Nearest Neighbor and 2-opt algorithms calculate the absolute shortest path to collect only the critical and high-fill bins."
            color="bg-orange-50 border-orange-100"
          />
          <FeatureCard 
            icon={<Send className="w-8 h-8 text-blue-600" />}
            title="Live Dispatch"
            description="Drivers receive an SMS link to a lightweight PWA navigation app. Admins see bins change from red to green in real-time."
            color="bg-blue-50 border-blue-100"
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm border-t border-gray-800">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trash2 className="w-6 h-6 text-gray-500" />
          <span className="font-bold text-xl text-gray-200">SmartWasteRouteAI</span>
        </div>
        <p>Hack-The-Gap 2.0 | MGM University IEEE × CSN Municipal Corporation</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className={`p-8 rounded-2xl border ${color} hover:shadow-lg transition-shadow duration-300`}>
      <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
