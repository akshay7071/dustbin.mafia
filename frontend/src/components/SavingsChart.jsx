import React from 'react';
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
            family: "'DM Sans', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        border: { display: false },
        grid: {
          color: '#F3F4F6'
        },
        title: {
          display: true,
          text: 'Distance (km)',
          color: '#6B7280',
          font: { size: 11 }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Optimized Route',
        data: [18.4, 21.2, 19.5, 17.8, 22.1, 16.5, 15.2],
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#16A34A',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Fixed Route Baseline',
        data: [42.0, 42.0, 42.0, 42.0, 42.0, 42.0, 42.0],
        borderColor: '#9CA3AF',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0
      }
    ]
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line options={options} data={data} />
    </div>
  );
}
