import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './Timeline.js';
import Modal from './Modal/index.js';
import DatePickerComponent from './Buttons/DatePicker.js';
import { FaSearchPlus, FaSearchMinus, FaPlus } from 'react-icons/fa';
import useNotification from '../../Components/Notification/index';
import useTimeBlocks from './Hooks/fetchTimeblocks.js';
import './css/dayCalendar.css';
import './css/mobile.css';

const DayCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { triggerNotification, NotificationComponent } = useNotification();
  const {
    blocks,
    timeBlocks,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    handleTimeBlockMove,
    formatDateKey,
  } = useTimeBlocks(triggerNotification);

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

// Assuming formatDateKey is a function that formats the date to 'YYYY-MM-DD'
const dateKey = formatDateKey(selectedDate);
const blocksForSelectedDate = [];

for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockDate = block.date;
    const blockDateSchema = block.schemaSettings;

    console.log(blockDateSchema);

    if (blockDate === dateKey) {
        blocksForSelectedDate.push(block);
    } else {
        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const daySettings = blockDateSchema[dayOfWeek];

        const isInPeriod = blockDateSchema.period.enabled &&
                   selectedDateObj >= new Date(blockDateSchema.period.startDate) &&
                   selectedDateObj <= new Date(blockDateSchema.period.endDate);

        const isInClosing = blockDateSchema.closing.enabled &&
                            selectedDateObj >= new Date(blockDateSchema.closing.startDate) &&
                            selectedDateObj <= new Date(blockDateSchema.closing.endDate);

        if ((daySettings && daySettings.enabled) && (isInPeriod && !isInClosing)) {
            blocksForSelectedDate.push(block);
        }

    }
}

console.log(blocksForSelectedDate);

  

  
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
