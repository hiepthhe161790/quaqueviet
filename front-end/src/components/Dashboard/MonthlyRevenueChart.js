import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyRevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: data.map(item => item.totalRevenue),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Doanh thu theo tháng trong năm',
        font: {
          size: 20,
          weight: 'bold',
        },
        color: '#7c3aed',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString()} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => value.toLocaleString(),
          color: '#4b5563',
        },
        grid: {
          color: '#e0e7ff',
        },
      },
      x: {
        ticks: {
          color: '#4b5563',
        },
        grid: {
          color: '#e0e7ff',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-400 mb-10">
      <Bar data={chartData} options={options} height={100} />
    </div>
  );
};

export default MonthlyRevenueChart;
