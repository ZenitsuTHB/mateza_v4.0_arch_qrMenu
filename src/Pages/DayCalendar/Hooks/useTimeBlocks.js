// src/hooks/useTimeBlocks.js

import { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';

const useTimeBlocks = (triggerNotification) => {
  const [timeBlocks, setTimeBlocks] = useState({});
  const api = useApi();

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/timeblocks/`, { noCache: true });
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

  const addTimeBlock = async (block) => {
    const dateKey = formatDateKey(new Date(block.date));
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      throw new Error('Overlap');
    }

    try {
      const response = await api.post(`${window.baseDomain}api/timeblocks/`, block);
      block._id = response.id;
      setTimeBlocks((prevTimeBlocks) => ({
        ...prevTimeBlocks,
        [dateKey]: [...(prevTimeBlocks[dateKey] || []), block],
      }));
      triggerNotification('Tijdsblok toegevoegd', 'success');
      return block;
    } catch (err) {
      console.error('Error adding time block:', err);
      throw err;
    }
  };

  const updateTimeBlock = async (block) => {
    const dateKey = formatDateKey(new Date(block.date));
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      throw new Error('Overlap');
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
      return block;
    } catch (err) {
      console.error('Error updating time block:', err);
      throw err;
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

  return {
    timeBlocks,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    handleTimeBlockMove,
    formatDateKey,
  };
};

export default useTimeBlocks;
