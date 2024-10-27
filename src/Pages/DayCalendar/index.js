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
  
  console.log(`\n--- Processing Selected Date ---`);
  console.log(`Selected Date: ${selectedDate}`);
  console.log(`Formatted Date Key: ${dateKey}`);
  
  for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockDate = block.date;
      const blockDateSchema = block.schemaSettings;
  
      console.log(`\n--- Processing Block ${i + 1} ---`);
      console.log(`Block Date: ${blockDate}`);
      console.log(`Block Schema Settings:`, blockDateSchema);
  
      if (!blockDateSchema) {
          console.warn(`--> Warning: block.schemaSettings is undefined for Block ${i + 1}. Skipping this block.`);
          continue; // Skip this block as schemaSettings is essential for further processing
      }
  
      if (blockDate === dateKey) {
          console.log(`--> Block date matches the selected date. Adding to blocksForSelectedDate.`);
          blocksForSelectedDate.push(block);
      } else {
          // Parse selectedDate into a Date object
          const selectedDateObj = new Date(selectedDate);
          if (isNaN(selectedDateObj)) {
              console.error(`--> Error: Invalid selectedDate format: ${selectedDate}`);
              continue; // Skip processing if selectedDate is invalid
          }
          console.log(`Selected Date Object: ${selectedDateObj} (${selectedDateObj.toISOString()})`);
  
          // Get the day of the week (e.g., "Monday")
          const dayOfWeek = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Europe/Berlin' });
          console.log(`Day of the Week: ${dayOfWeek}`);
  
          // Access the corresponding day settings in the schema
          const daySettings = blockDateSchema[dayOfWeek];
          if (!daySettings) {
              console.warn(`--> Warning: No settings found for ${dayOfWeek} in Block ${i + 1}.`);
          } else {
              console.log(`Day Settings for ${dayOfWeek}:`, daySettings);
          }
  
          // Initialize period and closing variables with default values
          const period = blockDateSchema.period ?? {};
          const closing = blockDateSchema.closing ?? {};
  
          let isInPeriod = false;
          let isInClosing = false;
  
          // Safely parse period dates
          if (period.enabled) {
              if (period.startDate && period.endDate) {
                  const periodStart = new Date(period.startDate);
                  const periodEnd = new Date(period.endDate);
  
                  if (isNaN(periodStart) || isNaN(periodEnd)) {
                      console.warn(`--> Warning: Invalid period dates in Block ${i + 1}.`);
                  } else {
                      console.log(`Period Start Date: ${period.startDate} (${periodStart.toISOString()})`);
                      console.log(`Period End Date: ${period.endDate} (${periodEnd.toISOString()})`);
  
                      isInPeriod = selectedDateObj >= periodStart && selectedDateObj <= periodEnd;
                      console.log(`Is in Period: ${isInPeriod}`);
                  }
              } else {
                  console.warn(`--> Warning: 'period' is enabled but 'startDate' or 'endDate' is missing in Block ${i + 1}.`);
              }
          } else {
              console.log(`Period is disabled for Block ${i + 1}.`);
          }
  
          // Safely parse closing dates
          if (closing.enabled) {
              if (closing.startDate && closing.endDate) {
                  const closingStart = new Date(closing.startDate);
                  const closingEnd = new Date(closing.endDate);
  
                  if (isNaN(closingStart) || isNaN(closingEnd)) {
                      console.warn(`--> Warning: Invalid closing dates in Block ${i + 1}.`);
                  } else {
                      console.log(`Closing Start Date: ${closing.startDate} (${closingStart.toISOString()})`);
                      console.log(`Closing End Date: ${closing.endDate} (${closingEnd.toISOString()})`);
  
                      isInClosing = selectedDateObj >= closingStart && selectedDateObj <= closingEnd;
                      console.log(`Is in Closing: ${isInClosing}`);
                  }
              } else {
                  console.warn(`--> Warning: 'closing' is enabled but 'startDate' or 'endDate' is missing in Block ${i + 1}.`);
              }
          } else {
              console.log(`Closing is disabled for Block ${i + 1}.`);
          }
  
          // Final condition check
          if (
              (daySettings?.enabled ?? false) &&
              (isInPeriod && !isInClosing)
          ) {
              console.log(`--> Conditions met. Adding block to blocksForSelectedDate.`);
              blocksForSelectedDate.push(block);
          } else {
              console.log(`--> Conditions not met. Block not added.`);
          }
      }
  }
  
  console.log(`\n--- Final blocksForSelectedDate ---`);
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
