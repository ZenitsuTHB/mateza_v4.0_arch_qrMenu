// src/components/NewReservation/SuccessMessage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { fields } from './formConfig';
import './css/successPage.css';

// Import jsPDF and html2canvas for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SuccessMessage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const summaryRef = useRef(null); // Reference to the summary div

  useEffect(() => {
    const data = localStorage.getItem('summary');
    if (data) {
      setSummaryData(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => {
    window.print(); // Triggers the print dialog
  };

  const handleShare = async () => {
    if (summaryRef.current) {
      // Capture the summary as an image
      const canvas = await html2canvas(summaryRef.current);
      const imgData = canvas.toDataURL('image/png');

      // Create a PDF with the captured image
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');

      // Check if the Web Share API is available
      if (navigator.share && navigator.canShare({ files: [new File([], '')] })) {
        const file = new File([pdfBlob], 'reservation.pdf', { type: 'application/pdf' });
        try {
          await navigator.share({
            title: 'Mijn Reservering',
            text: 'Bekijk mijn reservering.',
            files: [file],
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        // Fallback: Prompt the user to download the PDF
        pdf.save('reservation.pdf');
      }
    }
  };

  const handleAddToCalendar = () => {
    // Get restaurant name from localStorage or default to 'Demo'
    const restaurantName = localStorage.getItem('restaurant') || 'Demo';

    // Get date and time from summaryData
    const { datum, tijd } = summaryData;

    // Create a Date object for the start time
    const startDateTime = new Date(`${datum}T${tijd}`);

    // Add 2 hours for end time (assuming the reservation lasts 2 hours)
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    // Format dates for ICS
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const start = formatDate(startDateTime);
    const end = formatDate(endDateTime);

    const description = `Restaurant reservering bij ${restaurantName}`;
    const location = restaurantName;
    const subject = `Reservering bij ${restaurantName}`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${subject}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the ICS file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reservation.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reservation-form">
      <div className="success-message">
        <FaCheckCircle className="success-icon" />
        <p>Uw reservatie werd aangemaakt.</p>
      </div>

      {summaryData && (
        <div className="reservation-summary" ref={summaryRef}>
          <h2>Overzicht</h2>
          <ul>
            {fields.map((field) => (
              <li key={field.id}>
                <strong>{field.label}:</strong> {summaryData[field.id]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-button" onClick={handlePrint}>
          Print
        </button>
        <button className="action-button" onClick={handleShare}>
          Deel
        </button>
        <button className="action-button" onClick={handleAddToCalendar}>
          Agenda
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
