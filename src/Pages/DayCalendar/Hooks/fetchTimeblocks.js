// src/hooks/useTimeBlocks.js

import { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';
import { formatDateKey } from '../Utils/dateFormat';

const useTimeBlocks = (triggerNotification) => {
  const [timeBlocks, setTimeBlocks] = useState({});
  const [blocks, setBlocks] = useState({});
  const api = useApi();

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
        setBlocks(blocks);
      } catch (err) {
        console.error('[useTimeBlocks] Error fetching time blocks:', err);
      }
    };

    fetchTimeBlocks();
  }, [api]);

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  };

  const isOverlapping = (newBlock, existingBlocks) => {
    const newStart = parseTime(newBlock.startTime);
    const newEnd = parseTime(newBlock.endTime);

    for (const block of existingBlocks) {
      if (block._id === newBlock._id) {
        continue;
      }
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
    const dateKey = block.date;
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const response = await api.post(`${window.baseDomain}api/timeblocks/`, block);
      block._id = response.id;
      setTimeBlocks((prevTimeBlocks) => {
        const updatedBlocks = [...(prevTimeBlocks[dateKey] || []), block];
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok toegevoegd', 'success');
      return block;
    } catch (err) {
      throw err;
    }
  };

  const updateTimeBlock = async (block) => {
    const dateKey = block.date;
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(block, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${block._id}/`;
      await api.put(updateUrl, block);
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          return prevTimeBlocks;
        }
        const updatedBlocks = prevTimeBlocks[dateKey].map((b) =>
          b._id === block._id ? block : b
        );
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok bewerkt', 'success');
      return block;
    } catch (err) {
      throw err;
    }
  };

  const deleteTimeBlock = async (blockToDelete) => {
    try {
      const deleteUrl = `${window.baseDomain}api/timeblocks/${blockToDelete._id}/`;
      await api.delete(deleteUrl);
      const dateKey = blockToDelete.date;
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          return prevTimeBlocks;
        }
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
      console.error('[useTimeBlocks] Error deleting time block:', err);
    }
  };

  const handleTimeBlockMove = async (updatedBlock) => {
    const dateKey = updatedBlock.date;
    const existingBlocks = timeBlocks[dateKey] || [];

    if (isOverlapping(updatedBlock, existingBlocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${updatedBlock._id}/`;
      await api.put(updateUrl, updatedBlock);
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          return prevTimeBlocks;
        }
        const updatedBlocks = prevTimeBlocks[dateKey].map((b) =>
          b._id === updatedBlock._id ? updatedBlock : b
        );
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok verplaatst', 'success');
    } catch (err) {
      triggerNotification('Fout bij het verplaatsen van het tijdsblok', 'error');
    }
  };

  return {
    blocks,
    timeBlocks,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    handleTimeBlockMove,
    formatDateKey,
  };
};

export default useTimeBlocks;
