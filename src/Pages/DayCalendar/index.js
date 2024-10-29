// src/components/DayCalendar.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './time.js'; // Updated import (ensure the path is correct)
import Modal from './Modal/index.js';
import DatePickerComponent from './Buttons/DatePicker.js';
import { FaSearchPlus, FaSearchMinus, FaPlus } from 'react-icons/fa';
import useNotification from '../../Components/Notification/index';
import useTimeBlocks from './Hooks/fetchTimeblocks.js';
import useFilteredBlocks from './Hooks/useFilterBlocks.js';
import ShiftSelector from './Buttons/ShiftSelector.js'; // Updated import
import { shifts } from './Utils/constants.js';
import './css/dayCalendar.css';
import './css/mobile.css';

const DayCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // State for ShiftSelector
  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');

  // State for hiddenBefore (pinned hour)
  const [hiddenBefore, setHiddenBefore] = useState(null);

  const { triggerNotification, NotificationComponent } = useNotification();
  const {
    blocks,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    handleTimeBlockMove,
    formatDateKey,
  } = useTimeBlocks(triggerNotification);

  const blocksForSelectedDate = useFilteredBlocks(blocks, selectedDate, formatDateKey);

  // Initialize hiddenBefore from localStorage
  useEffect(() => {
    const storedHiddenBefore = localStorage.getItem('hiddenBefore');
    if (storedHiddenBefore !== null) {
      const parsedHiddenBefore = parseInt(storedHiddenBefore, 10);
      if (!isNaN(parsedHiddenBefore) && parsedHiddenBefore >= 0 && parsedHiddenBefore < 24) {
        setHiddenBefore(parsedHiddenBefore);
      }
    }
  }, []);

  const openModal = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel * 2);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel / 2);
    }
  };

  // Handle shift selection
  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
    setIsShiftOptionsOpen(false);

    if (shift && shifts[shift]) {
      const startHour = parseInt(shifts[shift].start.split(':')[0], 10);
      setHiddenBefore(startHour);
      localStorage.setItem('hiddenBefore', startHour);
    } else {
      setHiddenBefore(null);
      localStorage.removeItem('hiddenBefore');
    }
  };

  return (
    <div className="day-calendar-page">
      <NotificationComponent />
      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
      />

      {/* Shift Selector */}
      <ShiftSelector
        shifts={shifts}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        isShiftOptionsOpen={isShiftOptionsOpen}
        setIsShiftOptionsOpen={setIsShiftOptionsOpen}
        onShiftSelect={handleShiftSelection} // Pass the handler
      />

      <div className="day-calendar">
        <Timeline
          timeBlocks={blocksForSelectedDate}
          zoomLevel={zoomLevel}
          onTimeBlockClick={(block) => {
            setEditingBlock(block);
            setIsModalOpen(true);
          }}
          onTimeBlockMove={handleTimeBlockMove}
          hiddenBefore={hiddenBefore} // Pass hiddenBefore to Timeline
          setHiddenBefore={setHiddenBefore} // Pass setHiddenBefore to Timeline
        />
        {isModalOpen && (
          <Modal
            onClose={closeModal}
            onSave={editingBlock ? updateTimeBlock : addTimeBlock}
            onDelete={deleteTimeBlock}
            existingBlock={editingBlock}
            selectedDate={selectedDate}
            triggerNotification={triggerNotification}
          />
        )}
        <div className="controls">
          <button className="control-button green-button" onClick={openModal}>
            <FaPlus />
          </button>
          <button
            className="control-button round-button"
            onClick={handleZoomIn}
            disabled={zoomLevel === 2}
            style={{ display: zoomLevel === 2 ? 'none' : 'block' }}
          >
            <FaSearchPlus />
          </button>
          <button
            className="control-button"
            onClick={handleZoomOut}
            disabled={zoomLevel === 0.5}
            style={{ display: zoomLevel === 0.5 ? 'none' : 'block' }}
          >
            <FaSearchMinus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default withHeader(DayCalendar);
