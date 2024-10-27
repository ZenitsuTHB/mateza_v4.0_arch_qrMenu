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

  const dateKey = formatDateKey(selectedDate);
  const blocksForSelectedDate = [];
  
  console.log(`Selected Date: ${selectedDate}`);
  console.log(`Formatted Date Key: ${dateKey}`);
  
  for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockDate = block.date;
      const blockDateSchema = block.schemaSettings;
  
      console.log(`\nProcessing Block ${i + 1}:`);
      console.log(`Block Date: ${blockDate}`);
      console.log(`Block Schema Settings:`, blockDateSchema);
  
      if (blockDate === dateKey) {
          console.log(`--> Block date matches the selected date. Adding to blocksForSelectedDate.`);
          blocksForSelectedDate.push(block);
      } else {
          // Parse selectedDate into a Date object
          const selectedDateObj = new Date(selectedDate);
          console.log(`Selected Date Object: ${selectedDateObj} (${selectedDateObj.toISOString()})`);
  
          // Get the day of the week
          const dayOfWeek = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' });
          console.log(`Day of the Week: ${dayOfWeek}`);
  
          // Access the corresponding day settings in the schema
          const daySettings = blockDateSchema[dayOfWeek];
          console.log(`Day Settings for ${dayOfWeek}:`, daySettings);
  
          // Parse period dates
          const periodStart = new Date(blockDateSchema.period.startDate);
          const periodEnd = new Date(blockDateSchema.period.endDate);
          console.log(`Period Enabled: ${blockDateSchema.period.enabled}`);
          console.log(`Period Start Date: ${blockDateSchema.period.startDate} (${periodStart.toISOString()})`);
          console.log(`Period End Date: ${blockDateSchema.period.endDate} (${periodEnd.toISOString()})`);
  
          // Check if selectedDate is within the period
          const isInPeriod = blockDateSchema.period.enabled &&
                             selectedDateObj >= periodStart &&
                             selectedDateObj <= periodEnd;
          console.log(`Is in Period: ${isInPeriod}`);
  
          // Parse closing dates
          const closingStart = new Date(blockDateSchema.closing.startDate);
          const closingEnd = new Date(blockDateSchema.closing.endDate);
          console.log(`Closing Enabled: ${blockDateSchema.closing.enabled}`);
          console.log(`Closing Start Date: ${blockDateSchema.closing.startDate} (${closingStart.toISOString()})`);
          console.log(`Closing End Date: ${blockDateSchema.closing.endDate} (${closingEnd.toISOString()})`);
  
          // Check if selectedDate is within the closing period
          const isInClosing = blockDateSchema.closing.enabled &&
                              selectedDateObj >= closingStart &&
                              selectedDateObj <= closingEnd;
          console.log(`Is in Closing: ${isInClosing}`);
  
          // Final condition check
          if ((daySettings && daySettings.enabled) && (isInPeriod && !isInClosing)) {
              console.log(`--> Conditions met. Adding block to blocksForSelectedDate.`);
              blocksForSelectedDate.push(block);
          } else {
              console.log(`--> Conditions not met. Block not added.`);
          }
      }
  }
  
  console.log(`\nFinal blocksForSelectedDate:`, blocksForSelectedDate);
  

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
