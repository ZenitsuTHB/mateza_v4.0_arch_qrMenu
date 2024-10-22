// src/components/DayCalendar/DayCalendar.jsx

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './Timeline.js';
import Modal from './Modal/index.js';
import DatePickerComponent from './Modal/DataPicker.js';
import { FaSearchPlus, FaSearchMinus, FaPlus } from 'react-icons/fa';
import useApi from '../../Hooks/useApi';
import './css/dayCalendar.css';
import './css/mobile.css';

const DayCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const api = useApi();

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/timeblocks/`);
        const blocks = response || [];
        const blocksByDate = {};
        blocks.forEach((block) => {
          const dateKey = new Date(block.date).toDateString();
          if (!blocksByDate[dateKey]) {
            blocksByDate[dateKey] = [];
          }
          blocksByDate[dateKey].push(block);
        });
        setTimeBlocks(blocksByDate);
      } catch (err) {
        console.error('Error fetching time blocks:', err);
      }
    };

    fetchTimeBlocks();
  }, [api]);

  const openModal = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const addTimeBlock = (block) => {
    const dateKey = new Date(block.date).toDateString();
    setTimeBlocks((prevTimeBlocks) => ({
      ...prevTimeBlocks,
      [dateKey]: [...(prevTimeBlocks[dateKey] || []), block],
    }));
    closeModal();
  };

  const updateTimeBlock = (updatedBlock) => {
    const dateKey = new Date(updatedBlock.date).toDateString();
    setTimeBlocks((prevTimeBlocks) => ({
      ...prevTimeBlocks,
      [dateKey]: prevTimeBlocks[dateKey].map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      ),
    }));
    closeModal();
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

  const blocksForSelectedDate = timeBlocks[selectedDate.toDateString()] || [];

  return (
    <div className="day-calendar-page">
      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
      />
      <div className="day-calendar">
        <Timeline
          timeBlocks={blocksForSelectedDate}
          zoomLevel={zoomLevel}
          onTimeBlockClick={(block) => {
            setEditingBlock(block);
            setIsModalOpen(true);
          }}
        />
        {isModalOpen && (
          <Modal
            onClose={closeModal}
            onSave={editingBlock ? updateTimeBlock : addTimeBlock}
            existingBlock={editingBlock}
            selectedDate={selectedDate}
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
