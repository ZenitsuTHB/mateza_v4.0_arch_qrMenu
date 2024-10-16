// src/components/NewReservation/SuccessMessage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaPrint, FaShareAlt, FaCalendarPlus } from 'react-icons/fa';
import { fields } from '../formConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../css/successPage.css';

const SuccessMessage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem('summary');
    if (data) {
      setSummaryData(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (summaryRef.current) {
      const canvas = await html2canvas(summaryRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');

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
        pdf.save('reservation.pdf');
      }
    }
  };

  const handleAddToCalendar = () => {
    const restaurantName = localStorage.getItem('restaurant') || 'Demo';
    const { datum, tijd } = summaryData;
    const startDateTime = new Date(`${datum}T${tijd}`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

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
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reservation.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
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

      <div className="action-buttons">
        <button className="action-button" onClick={handlePrint}>
          <FaPrint className="button-icon" />
          Print
        </button>
        <button className="action-button" onClick={handleShare}>
          <FaShareAlt className="button-icon" />
          Deel
        </button>
        <button className="action-button" onClick={handleAddToCalendar}>
          <FaCalendarPlus className="button-icon" />
          Agenda
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
