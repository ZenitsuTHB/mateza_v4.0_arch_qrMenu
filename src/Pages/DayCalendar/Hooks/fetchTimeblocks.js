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
      console.log('[useTimeBlocks] Fetching time blocks...');
      try {
        const response = await api.get(`${window.baseDomain}api/timeblocks/`, { noCache: true });
        console.log('[useTimeBlocks] Response received:', response);
        const blocks = response || [];
        console.log('[useTimeBlocks] Parsed blocks:', blocks);
        const blocksByDate = {};

        blocks.forEach((block) => {
          const dateKey = block.date;
          if (!blocksByDate[dateKey]) {
            blocksByDate[dateKey] = [];
            console.log(`[useTimeBlocks] Created new dateKey: ${dateKey}`);
          }
          blocksByDate[dateKey].push(block);
        });

        console.log('[useTimeBlocks] Blocks grouped by date:', blocksByDate);
        setTimeBlocks(blocksByDate);
        setBlocks(blocks);
        console.log('[useTimeBlocks] State updated: timeBlocks and blocks set');
      } catch (err) {
        console.error('[useTimeBlocks] Error fetching time blocks:', err);
      }
    };

    fetchTimeBlocks();
  }, [api]);

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    console.log(`[useTimeBlocks] Parsed timeString "${timeString}" to minutes: ${totalMinutes}`);
    return totalMinutes;
  };

  const isOverlapping = (newBlock, existingBlocks) => {
    console.log('[useTimeBlocks] Checking overlap for newBlock:', newBlock);
    console.log('[useTimeBlocks] Existing blocks:', existingBlocks);
    const newStart = parseTime(newBlock.startTime);
    const newEnd = parseTime(newBlock.endTime);

    for (const block of existingBlocks) {
      if (block._id === newBlock._id) {
        console.log(`[useTimeBlocks] Skipping block with same _id: ${block._id}`);
        continue;
      }
      const blockStart = parseTime(block.startTime);
      const blockEnd = parseTime(block.endTime);

      console.log(`[useTimeBlocks] Comparing with block: ${block._id}, Start: ${blockStart}, End: ${blockEnd}`);

      if (
        (newStart >= blockStart && newStart < blockEnd) ||
        (newEnd > blockStart && newEnd <= blockEnd) ||
        (newStart <= blockStart && newEnd >= blockEnd)
      ) {
        console.warn('[useTimeBlocks] Overlapping detected:', block);
        return true;
      }
    }
    console.log('[useTimeBlocks] No overlapping detected');
    return false;
  };

  const addTimeBlock = async (block) => {
    console.log('[useTimeBlocks] Adding time block:', block);
    const dateKey = block.date;
    const existingBlocks = timeBlocks[dateKey] || [];
    console.log(`[useTimeBlocks] Existing blocks for dateKey "${dateKey}":`, existingBlocks);

    if (isOverlapping(block, existingBlocks)) {
      console.warn('[useTimeBlocks] Time block overlaps with existing block');
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const response = await api.post(`${window.baseDomain}api/timeblocks/`, block);
      console.log('[useTimeBlocks] Add response:', response);
      block._id = response.id;
      setTimeBlocks((prevTimeBlocks) => {
        const updatedBlocks = [...(prevTimeBlocks[dateKey] || []), block];
        console.log(`[useTimeBlocks] Updated blocks for dateKey "${dateKey}":`, updatedBlocks);
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok toegevoegd', 'success');
      return block;
    } catch (err) {
      console.error('[useTimeBlocks] Error adding time block:', err);
      throw err;
    }
  };

  const updateTimeBlock = async (block) => {
    console.log('[useTimeBlocks] Updating time block:', block);
    const dateKey = block.date;
    const existingBlocks = timeBlocks[dateKey] || [];
    console.log(`[useTimeBlocks] Existing blocks for dateKey "${dateKey}":`, existingBlocks);

    if (isOverlapping(block, existingBlocks)) {
      console.warn('[useTimeBlocks] Time block overlaps with existing block');
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${block._id}/`;
      console.log(`[useTimeBlocks] Sending PUT request to: ${updateUrl} with data:`, block);
      await api.put(updateUrl, block);
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          console.error(`[useTimeBlocks] No blocks found for dateKey "${dateKey}" during update`);
          return prevTimeBlocks;
        }
        const updatedBlocks = prevTimeBlocks[dateKey].map((b) =>
          b._id === block._id ? block : b
        );
        console.log(`[useTimeBlocks] Updated blocks for dateKey "${dateKey}":`, updatedBlocks);
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok bewerkt', 'success');
      return block;
    } catch (err) {
      console.error('[useTimeBlocks] Error updating time block:', err);
      throw err;
    }
  };

  const deleteTimeBlock = async (blockToDelete) => {
    console.log('[useTimeBlocks] Deleting time block:', blockToDelete);
    try {
      const deleteUrl = `${window.baseDomain}api/timeblocks/${blockToDelete._id}/`;
      console.log(`[useTimeBlocks] Sending DELETE request to: ${deleteUrl}`);
      await api.delete(deleteUrl);
      const dateKey = blockToDelete.date;
      console.log(`[useTimeBlocks] Deleting block from dateKey "${dateKey}"`);
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          console.error(`[useTimeBlocks] No blocks found for dateKey "${dateKey}" during delete`);
          return prevTimeBlocks;
        }
        const updatedBlocks = prevTimeBlocks[dateKey].filter(
          (block) => block._id !== blockToDelete._id
        );
        console.log(`[useTimeBlocks] Updated blocks after deletion for dateKey "${dateKey}":`, updatedBlocks);
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
    console.log('[useTimeBlocks] Moving time block:', updatedBlock);
    const dateKey = updatedBlock.date;
    const existingBlocks = timeBlocks[dateKey] || [];
    console.log(`[useTimeBlocks] Existing blocks for dateKey "${dateKey}":`, existingBlocks);

    if (isOverlapping(updatedBlock, existingBlocks)) {
      console.warn('[useTimeBlocks] Time block overlaps with existing block during move');
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${updatedBlock._id}/`;
      console.log(`[useTimeBlocks] Sending PUT request to: ${updateUrl} with data:`, updatedBlock);
      await api.put(updateUrl, updatedBlock);
      setTimeBlocks((prevTimeBlocks) => {
        if (!prevTimeBlocks[dateKey]) {
          console.error(`[useTimeBlocks] No blocks found for dateKey "${dateKey}" during move`);
          return prevTimeBlocks;
        }
        const updatedBlocks = prevTimeBlocks[dateKey].map((b) =>
          b._id === updatedBlock._id ? updatedBlock : b
        );
        console.log(`[useTimeBlocks] Updated blocks after move for dateKey "${dateKey}":`, updatedBlocks);
        return {
          ...prevTimeBlocks,
          [dateKey]: updatedBlocks,
        };
      });
      triggerNotification('Tijdsblok verplaatst', 'success');
    } catch (err) {
      console.error('[useTimeBlocks] Error moving time block:', err);
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
