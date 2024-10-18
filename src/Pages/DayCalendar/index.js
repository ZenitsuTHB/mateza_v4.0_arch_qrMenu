import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './Timeline.js';
import Modal from './ModalView';
import { FaSearchPlus, FaSearchMinus, FaPlus } from 'react-icons/fa';
import './css/dayCalendar.css';

const DayCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editingBlock, setEditingBlock] = useState(null);

  const openModal = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const addTimeBlock = (block) => {
    setTimeBlocks([...timeBlocks, block]);
    closeModal();
  };

  const updateTimeBlock = (updatedBlock) => {
    setTimeBlocks(
      timeBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
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

  return (
    <div className="day-calendar">
      <Timeline
        timeBlocks={timeBlocks}
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
  );
};

export default withHeader(DayCalendar);