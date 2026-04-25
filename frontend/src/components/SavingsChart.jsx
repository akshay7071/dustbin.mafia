import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SavingsChart() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    
    // Create a smooth gradient for the optimized route
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(34, 211, 238, 0.4)'); // Cyan 400
    gradientFill.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

    setChartData({
      labels,
      datasets: [
        {
          label: 'Optimized Route',
          data: [18.4, 21.2, 19.5, 17.8, 22.1, 16.5, 15.2],
          borderColor: '#22d3ee', // Cyan 400
          backgroundColor: gradientFill,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#050914',
          pointBorderColor: '#22d3ee',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#22d3ee',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
        {
          label: 'Fixed Route Baseline',
          data: [42.0, 42.0, 42.0, 42.0, 42.0, 42.0, 42.0],
          borderColor: '#64748b', // Slate 500
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'JetBrains Mono', monospace",
            size: 12,
            weight: '500'
          },
          color: '#cbd5e1' // Slate 300
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(5, 9, 20, 0.95)',
        titleColor: '#22d3ee', // Cyan 400
        titleFont: {
          family: "'JetBrains Mono', monospace",
          size: 13,
          weight: '600'
        },
        bodyColor: '#f8fafc', // Slate 50
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ${context.parsed.y} km`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
            size: 12
          },
          color: '#64748b' // Slate 500
        }
      },
      y: {
        border: { display: false },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'Distance (km)',
          color: '#64748b',
          font: { 
            family: "'JetBrains Mono', monospace",
            size: 12,
            weight: '500'
          }
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
            size: 12
          },
          color: '#64748b'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Line ref={chartRef} options={options} data={chartData || {
        labels, datasets: [{
          label: 'Optimized Route', data: [18.4, 21.2, 19.5, 17.8, 22.1, 16.5, 15.2],
          borderColor: '#22d3ee', backgroundColor: 'rgba(34, 211, 238, 0.1)',
          borderWidth: 3, tension: 0.4, fill: true
        }, {
          label: 'Fixed Route Baseline', data: [42.0, 42.0, 42.0, 42.0, 42.0, 42.0, 42.0],
          borderColor: '#64748b', borderWidth: 2, borderDash: [5, 5], tension: 0, fill: false
        }]
      }} />
    </div>
  );
}
