import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import Timeline from './Timeline.js';
import Modal from './ModalView';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
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
    setZoomLevel(zoomLevel * 2);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel / 2);
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
        <button className="control-button plus" onClick={openModal}>+</button>
        <button className="control-button" onClick={handleZoomIn}>
          <FaSearchPlus />
        </button>
        <button className="control-button" onClick={handleZoomOut}>
          <FaSearchMinus />
        </button>
      </div>
    </div>
  );
};

export default withHeader(DayCalendar);
