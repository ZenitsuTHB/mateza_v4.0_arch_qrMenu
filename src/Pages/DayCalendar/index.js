// src/components/DayCalendar/DayCalendar.jsx

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './Timeline.js';
import Modal from './Modal/index.js';
import DatePickerComponent from './Modal/DataPicker.js';
import { FaSearchPlus, FaSearchMinus, FaPlus } from 'react-icons/fa';
import useApi from '../../Hooks/useApi';
import Draggable from 'react-draggable'; // Ensure this is imported
import useNotification from '../../Components/Notification/index';
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
  const { triggerNotification, NotificationComponent } = useNotification();
  const formatDateKey = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/timeblocks/`);
        const blocks = response || [];
        const blocksByDate = {};

        blocks.forEach((block) => {
          const dateKey = block.date;
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

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isOverlapping = (newBlock, existingBlocks) => {
    const newStart = parseTime(newBlock.startTime);
    const newEnd = parseTime(newBlock.endTime);

    for (const block of existingBlocks) {
      if (block._id === newBlock._id) continue;
      const blockStart = parseTime(block.startTime);
      const blockEnd = parseTime(block.endTime);

      if (
        (newStart >= blockStart && newStart < blockEnd) ||
        (newEnd > blockStart && newEnd <= blockEnd) ||
        (newStart <= blockStart && newEnd >= blockEnd)
      ) {
        return true;
      }
    }
    return false;
  };

  // Add a new time block
  const addTimeBlock = async (block) => {
    const dateKey = formatDateKey(new Date(block.date));
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const response = await api.post(`${window.baseDomain}api/timeblocks/`, block);
      block._id = response.id;
      setTimeBlocks((prevTimeBlocks) => ({
        ...prevTimeBlocks,
        [dateKey]: [...(prevTimeBlocks[dateKey] || []), block],
      }));
      triggerNotification('Tijdsblok toegevoegd', 'success');
    } catch (err) {
      console.error('Error adding time block:', err);
    } finally {
      closeModal();
    }
  };

  const updateTimeBlock = async (block) => {
    const dateKey = formatDateKey(new Date(block.date));
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      await api.put(`${window.baseDomain}api/timeblocks/${block._id}/`, block);
      setTimeBlocks((prevTimeBlocks) => ({
        ...prevTimeBlocks,
        [dateKey]: prevTimeBlocks[dateKey].map((b) =>
          b._id === block._id ? block : b
        ),
      }));
      triggerNotification('Tijdsblok bewerkt', 'success');
    } catch (err) {
      console.error('Error updating time block:', err);
    } finally {
      closeModal();
    }
  };

  const deleteTimeBlock = async (blockToDelete) => {
    try {
      await api.delete(`${window.baseDomain}api/timeblocks/${blockToDelete._id}/`);
      const dateKey = formatDateKey(new Date(blockToDelete.date));
      setTimeBlocks((prevTimeBlocks) => {
        const updatedBlocks = prevTimeBlocks[dateKey].filter(
          (block) => block._id !== blockToDelete._id
        );
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok verwijderd', 'success');
    } catch (err) {
      console.error('Error deleting time block:', err);
    } finally {
      closeModal();
    }
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

  const handleTimeBlockMove = async (updatedBlock) => {
    const dateKey = formatDateKey(new Date(updatedBlock.date));
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(updatedBlock, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      await api.put(`${window.baseDomain}api/timeblocks/${updatedBlock._id}/`, updatedBlock);
      setTimeBlocks((prevTimeBlocks) => ({
        ...prevTimeBlocks,
        [dateKey]: prevTimeBlocks[dateKey].map((b) =>
          b._id === updatedBlock._id ? updatedBlock : b
        ),
      }));
      triggerNotification('Tijdsblok verplaatst', 'success');
    } catch (err) {
      console.error('Error updating time block:', err);
      triggerNotification('Fout bij het verplaatsen van het tijdsblok', 'error');
    }
  };

  const dateKey = formatDateKey(selectedDate);
  const blocksForSelectedDate = timeBlocks[dateKey] || [];

  return (
    <div className="day-calendar-page">
      <NotificationComponent />
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
          onTimeBlockMove={handleTimeBlockMove}
        />
        {isModalOpen && (
          <Modal
            onClose={closeModal}
            onSave={editingBlock ? updateTimeBlock : addTimeBlock}
            onDelete={deleteTimeBlock}
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
