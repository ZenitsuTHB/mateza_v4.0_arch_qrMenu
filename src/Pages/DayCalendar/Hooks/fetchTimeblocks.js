// src/hooks/useTimeBlocks.js

import { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';
import { formatDateKey } from '../Utils/dateFormat';

const useTimeBlocks = (triggerNotification) => {
  const [blocks, setBlocks] = useState([]);
  const api = useApi();

  useEffect(() => {
    const fetchTimeBlocks = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/timeblocks/`, { noCache: true });
        const blocksData = response || [];
        setBlocks(blocksData);
      } catch (err) {
        console.error('[useTimeBlocks] Error fetching time blocks:', err);
      }
    };

    fetchTimeBlocks();
  }, [api]);

  const addTimeBlock = async (block) => {

    try {
      const response = await api.post(`${window.baseDomain}api/timeblocks/`, block);
      block._id = response.id;
      setBlocks((prevBlocks) => [...prevBlocks, block]);
      triggerNotification('Tijdsblok toegevoegd', 'success');
      return block;
    } catch (err) {
      console.error('[useTimeBlocks] Error adding time block:', err);
      throw err;
    }
  };

  const updateTimeBlock = async (block) => {
    if (isOverlapping(block, blocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${block._id}/`;
      await api.put(updateUrl, block);
      setBlocks((prevBlocks) =>
        prevBlocks.map((b) => (b._id === block._id ? block : b))
      );
      triggerNotification('Tijdsblok bewerkt', 'success');
      return block;
    } catch (err) {
      console.error('[useTimeBlocks] Error updating time block:', err);
      throw err;
    }
  };

  const deleteTimeBlock = async (blockToDelete) => {
    try {
      const deleteUrl = `${window.baseDomain}api/timeblocks/${blockToDelete._id}/`;
      await api.delete(deleteUrl);
      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block._id !== blockToDelete._id)
      );
      triggerNotification('Tijdsblok verwijderd', 'success');
    } catch (err) {
      console.error('[useTimeBlocks] Error deleting time block:', err);
    }
  };

  const handleTimeBlockMove = async (updatedBlock) => {
    if (isOverlapping(updatedBlock, blocks)) {
      triggerNotification('Tijdsblok overlapt met een bestaand tijdsblok', 'warning');
      return;
    }

    try {
      const updateUrl = `${window.baseDomain}api/timeblocks/${updatedBlock._id}/`;
      await api.put(updateUrl, updatedBlock);
      setBlocks((prevBlocks) =>
        prevBlocks.map((b) => (b._id === updatedBlock._id ? updatedBlock : b))
      );
      triggerNotification('Tijdsblok verplaatst', 'success');
    } catch (err) {
      console.error('[useTimeBlocks] Error moving time block:', err);
      triggerNotification('Fout bij het verplaatsen van het tijdsblok', 'error');
    }
  };

  return {
    blocks,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    handleTimeBlockMove,
    formatDateKey,
  };
};

export default useTimeBlocks;
