// BarChartView.js

import React, { useEffect, useState } from 'react';
import './css/barChartView.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { maxCapacity } from './reservationData'; // Adjust the import path as needed

const BarChartView = ({
  currentDate,
  reservationsByDate,
  selectedShift,
  selectedViewMode,
  maxCapacity,
  predictionsByDate,
  weekOrMonthView, // New prop
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    let startDate, endDate;
    const labels = [];
    let datasets = [];

    // Define time slot names and colors
    const timeSlotNames = ['Ochtend', 'Middag', 'Avond'];
    const timeSlotColors = ['#182825', '#016FB9', '#22AED1'];

    // Determine the date range based on the current view
    if (weekOrMonthView === 'month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (weekOrMonthView === 'week') {
      const getMonday = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      };
      startDate = getMonday(currentDate);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    }

    // Generate an array of dates within the selected range
    const dateArray = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateArray.push(new Date(d));
    }

    if (selectedViewMode === 'Algemeen' && selectedShift === 'Dag') {
      // Stacked bar chart for 'Algemeen' view with 'Dag' shift
      const dataByTimeSlot = [[], [], []]; // [Ochtend, Middag, Avond]

      dateArray.forEach((date) => {
        const dateString = date.toISOString().split('T')[0];
        if (weekOrMonthView === 'month') {
          labels.push(date.getDate());
        } else if (weekOrMonthView === 'week') {
          labels.push(date.toLocaleDateString('nl-NL', { weekday: 'short' }));
        }

        const reservations = reservationsByDate[dateString] || [];

        const totalGuestsByTimeSlot = [0, 0, 0]; // Ochtend, Middag, Avond

        reservations.forEach((res) => {
          totalGuestsByTimeSlot[res.timeSlot] += res.aantalGasten;
        });

        // Push the data for each time slot
        for (let timeSlot = 0; timeSlot < 3; timeSlot++) {
          dataByTimeSlot[timeSlot].push(totalGuestsByTimeSlot[timeSlot]);
        }
      });

      // Create datasets for each time slot
      datasets = timeSlotNames.map((name, index) => ({
        label: name,
        data: dataByTimeSlot[index],
        backgroundColor: timeSlotColors[index],
      }));
    } else {
      // Other view modes
      const data = [];

      dateArray.forEach((date) => {
        const dateString = date.toISOString().split('T')[0];
        if (weekOrMonthView === 'month') {
          labels.push(date.getDate());
        } else if (weekOrMonthView === 'week') {
          labels.push(date.toLocaleDateString('nl-NL', { weekday: 'short' }));
        }

        let totalGuests = 0;

        if (selectedViewMode === 'Voorspelling') {
          // Use predictions
          totalGuests = predictionsByDate[dateString] || 0;
        } else {
          const reservations = reservationsByDate[dateString] || [];
          // Calculate total guests based on selectedShift
          reservations.forEach((res) => {
            if (
              selectedShift === 'Dag' ||
              (selectedShift === 'Ochtend' && res.timeSlot === 0) ||
              (selectedShift === 'Middag' && res.timeSlot === 1) ||
              (selectedShift === 'Avond' && res.timeSlot === 2)
            ) {
              totalGuests += res.aantalGasten;
            }
          });
        }

        if (selectedViewMode === 'Bezettingspercentage') {
          // Calculate occupancy percentage
          const occupancyRate = (totalGuests / maxCapacity) * 100;
          data.push(parseFloat(occupancyRate.toFixed(1)));
        } else {
          data.push(totalGuests);
        }
      });

      // Determine background color based on selectedViewMode and selectedShift
      let backgroundColor = '';
      if (selectedViewMode === 'Bezettingspercentage') {
        backgroundColor = '#28a745'; // Green
      } else if (selectedViewMode === 'Bezettingsgraad') {
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
        // 'Algemeen' view with specific shift
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
            selectedViewMode === 'Bezettingspercentage'
              ? 'Bezettingsgraad (%)'
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
    weekOrMonthView, // Added to dependencies
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
          text: weekOrMonthView === 'week' ? 'Dag van de Week' : 'Dag van de Maand',
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
