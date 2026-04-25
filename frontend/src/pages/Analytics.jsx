import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SavingsChart from '../components/SavingsChart';
import { Calendar, Download, TrendingDown, Fuel, Leaf, IndianRupee } from 'lucide-react';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Savings Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Track the environmental and financial impact of optimized routing.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </select>
              <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            icon={<TrendingDown className="w-5 h-5 text-blue-600" />}
            title="Total km Saved"
            value="387 km"
            subtext="vs Fixed Route"
            trend="+12%"
            color="bg-blue-50 border-blue-100"
          />
          <MetricCard 
            icon={<Fuel className="w-5 h-5 text-orange-600" />}
            title="Fuel Saved"
            value="46.4 L"
            subtext="Diesel avoided"
            trend="+8%"
            color="bg-orange-50 border-orange-100"
          />
          <MetricCard 
            icon={<Leaf className="w-5 h-5 text-green-600" />}
            title="CO₂ Avoided"
            value="104.9 kg"
            subtext="Emissions cut"
            trend="+15%"
            color="bg-green-50 border-green-100"
          />
          <MetricCard 
            icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
            title="Cost Saved"
            value="₹4,269"
            subtext="Estimated INR"
            trend="+12%"
            color="bg-emerald-50 border-emerald-100"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Distance: Optimized vs Baseline</h3>
            <div className="h-80">
              <SavingsChart />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Collections by Zone</h3>
            <div className="space-y-4">
              <BarChartRow label="Commercial Areas" percentage={45} color="bg-orange-500" />
              <BarChartRow label="Residential Zones" percentage={30} color="bg-blue-500" />
              <BarChartRow label="Industrial Sectors" percentage={15} color="bg-gray-500" />
              <BarChartRow label="Public Parks" percentage={10} color="bg-green-500" />
            </div>
            <div className="mt-8 text-sm text-gray-500 border-t pt-4">
              Commercial areas require 3x more frequent collections than industrial sectors based on AI predictions.
            </div>
          </div>
        </div>

        {/* Route History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Route History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Route ID</th>
                  <th className="px-6 py-3 text-center">Stops</th>
                  <th className="px-6 py-3 text-right">Distance (km)</th>
                  <th className="px-6 py-3 text-right">Fuel Saved (L)</th>
                  <th className="px-6 py-3 text-right">CO₂ (kg)</th>
                </tr>
              </thead>
              <tbody>
                <TableRow date="Today, 08:30 AM" id="rt_8f7a9" stops={23} km={18.4} fuel={2.8} co2={6.3} />
                <TableRow date="Yesterday, 02:15 PM" id="rt_2c4b1" stops={18} km={15.2} fuel={3.2} co2={7.2} />
                <TableRow date="Oct 12, 09:00 AM" id="rt_9m3x5" stops={28} km={22.1} fuel={2.4} co2={5.4} />
                <TableRow date="Oct 11, 01:45 PM" id="rt_5k2l8" stops={21} km={17.8} fuel={2.9} co2={6.5} />
                <TableRow date="Oct 10, 08:15 AM" id="rt_1p7q4" stops={25} km={19.5} fuel={2.7} co2={6.1} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, subtext, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mt-1 mb-1">{value}</h4>
        <p className="text-xs text-gray-400">{subtext}</p>
      </div>
    </div>
  );
}

function BarChartRow({ label, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function TableRow({ date, id, stops, km, fuel, co2 }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">{date}</td>
      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{id}</td>
      <td className="px-6 py-4 text-center">
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{stops}</span>
      </td>
      <td className="px-6 py-4 text-right font-medium">{km}</td>
      <td className="px-6 py-4 text-right text-green-600">{fuel}</td>
      <td className="px-6 py-4 text-right text-gray-500">{co2}</td>
    </tr>
  );
}
