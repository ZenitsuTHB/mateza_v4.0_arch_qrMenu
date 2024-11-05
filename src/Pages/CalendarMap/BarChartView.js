// BarChartView.js

import React, { useEffect, useState } from 'react';
import './css/barChartView.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChartView = ({
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode,
  maxCapacity,
  predictionsByDate,
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Prepare data for the chart
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDays = endDate.getDate();

    const labels = [];
    let datasets = [];

    const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
    const timeSlotColors = ['#182825', '#016FB9', '#22AED1'];

    if (selectedViewMode === 'Normaal' && selectedShift === 'Hele Dag') {
      // Stacked bar chart for 'Normaal' view with 'Hele Dag' shift
      const dataByTimeSlot = [[], [], []]; // [Ochtend, Middag, Avond]

      for (let i = 1; i <= numDays; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(i);

        const reservations = reservationsByDate[dateString] || [];

        const totalGuestsByTimeSlot = [0, 0, 0]; // Ochtend, Middag, Avond

        reservations.forEach((res) => {
          totalGuestsByTimeSlot[res.timeSlot] += res.aantalGasten;
        });

        // Push the data for each time slot
        for (let timeSlot = 0; timeSlot < 3; timeSlot++) {
          dataByTimeSlot[timeSlot].push(totalGuestsByTimeSlot[timeSlot]);
        }
      }

      // Create datasets
      datasets = timeSlotNames.map((name, index) => ({
        label: name,
        data: dataByTimeSlot[index],
        backgroundColor: timeSlotColors[index],
      }));
    } else {
      // Other view modes
      const data = [];

      for (let i = 1; i <= numDays; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(i);

        let totalGuests = 0;

        if (selectedViewMode === 'Voorspelling') {
          // Use predictions
          totalGuests = predictionsByDate[dateString] || 0;
        } else {
          const reservations = reservationsByDate[dateString] || [];
          // Calculate total guests based on selectedShift
          reservations.forEach((res) => {
            if (
              selectedShift === 'Hele Dag' ||
              (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
              (selectedShift === 'Middag' && res.timeSlot === 1) ||
              (selectedShift === 'Avond' && res.timeSlot === 2)
            ) {
              totalGuests += res.aantalGasten;
            }
          });
        }

        if (selectedViewMode === 'Bezetting') {
          // Calculate occupancy percentage
          const occupancyRate = (totalGuests / maxCapacity) * 100;
          data.push(parseFloat(occupancyRate.toFixed(1)));
        } else {
          data.push(totalGuests);
        }
      }

      // Determine background color based on selectedViewMode and selectedShift
      let backgroundColor = '';
      if (selectedViewMode === 'Bezetting') {
        backgroundColor = '#28a745'; // Green
      } else if (selectedViewMode === 'Heatmap') {
        if (selectedShift === 'Ochtend') {
          backgroundColor = '#182825';
        } else if (selectedShift === 'Middag') {
          backgroundColor = '#016FB9';
        } else if (selectedShift === 'Avond') {
          backgroundColor = '#22AED1';
        } else {
          backgroundColor = '#007bff';
        }
      } else if (selectedViewMode === 'Voorspelling') {
        backgroundColor = '#ff0000'; // Red for predictions
      } else {
        // 'Normaal' view with specific shift
        if (selectedShift === 'Ochtend') {
          backgroundColor = '#182825';
        } else if (selectedShift === 'Middag') {
          backgroundColor = '#016FB9';
        } else if (selectedShift === 'Avond') {
          backgroundColor = '#22AED1';
        } else {
          backgroundColor = '#007bff';
        }
      }

      datasets = [
        {
          label:
            selectedViewMode === 'Bezetting'
              ? 'Bezetting (%)'
              : selectedViewMode === 'Voorspelling'
              ? 'Voorspelling Aantal Gasten'
              : 'Aantal Gasten',
          data: data,
          backgroundColor: Array.isArray(backgroundColor)
            ? backgroundColor
            : new Array(data.length).fill(backgroundColor),
        },
      ];
    }

    const chartData = {
      labels: labels,
      datasets: datasets,
    };

    setChartData(chartData);
  }, [
    currentDate,
    reservationsByDate,
    selectedShift,
    selectedViewMode,
    maxCapacity,
    predictionsByDate,
  ]);

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
            if (selectedViewMode === 'Bezetting') {
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
        max: selectedViewMode === 'Bezetting' ? 100 : undefined,
        title: {
          display: true,
          text: selectedViewMode === 'Bezetting' ? 'Bezetting (%)' : 'Aantal Gasten',
        },
        stacked: selectedViewMode === 'Normaal' && selectedShift === 'Hele Dag',
      },
      x: {
        title: {
          display: true,
          text: 'Dag van de Maand',
        },
        stacked: selectedViewMode === 'Normaal' && selectedShift === 'Hele Dag',
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
