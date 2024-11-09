// BarChartView.js

import React from 'react';
import './css/barChartView.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import useChartData from './Hooks/useChartData';

const BarChartView = ({
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode,
  maxCapacity,
  predictionsByDate,
  weekOrMonthView,
}) => {
  const chartData = useChartData({
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode,
    maxCapacity,
    predictionsByDate,
    weekOrMonthView,
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (selectedViewMode === 'Bezettingspercentage') {
              return `${context.parsed.y}%`;
            } else {
              return `${context.parsed.y} gasten`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: selectedViewMode === 'Bezettingspercentage' ? 100 : undefined,
        title: {
          display: true,
          text:
            selectedViewMode === 'Bezettingspercentage'
              ? 'Bezettingsgraad (%)'
              : 'Aantal Gasten',
        },
        stacked: selectedViewMode === 'Algemeen' && selectedShift === 'Dag',
      },
      x: {
        title: {
          display: true,
          text:
            weekOrMonthView === 'week' ? 'Dag van de Week' : 'Dag van de Maand',
        },
        stacked: selectedViewMode === 'Algemeen' && selectedShift === 'Dag',
      },
    },
  };

  return (
    <div className="bar-chart-view">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartView;
