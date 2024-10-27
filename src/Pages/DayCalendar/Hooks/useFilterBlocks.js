// src/hooks/useFilteredBlocks.js

import { useMemo } from 'react';

/**
 * Custom hook to filter blocks based on the selected date.
 *
 * @param {Array} blocks - The array of block objects to filter.
 * @param {Date} selectedDate - The currently selected date.
 * @param {Function} formatDateKey - Function to format the date into a key string.
 * @returns {Array} - The filtered array of blocks for the selected date.
 */
const useFilteredBlocks = (blocks, selectedDate, formatDateKey) => {
  const blocksForSelectedDate = useMemo(() => {
    const dateKey = formatDateKey(selectedDate);
    const filteredBlocks = [];

    console.log(`\n--- Processing Selected Date in useFilteredBlocks ---`);
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
        filteredBlocks.push(block);
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

        // Check if the day is enabled
        const isDayEnabled = daySettings?.enabled ?? false;
        console.log(`Is ${dayOfWeek} Enabled: ${isDayEnabled}`);

        // Final condition check
        if (isDayEnabled) {
          console.log(`--> Day is enabled. Adding block to blocksForSelectedDate.`);
          filteredBlocks.push(block);
        } else {
          console.log(`--> Day is not enabled. Block not added.`);
        }
      }
    }

    console.log(`\n--- Final Blocks for Selected Date in useFilteredBlocks ---`);
    console.log(filteredBlocks);

    return filteredBlocks;
  }, [blocks, selectedDate, formatDateKey]);

  // **Corrected Return Statement**
  return blocksForSelectedDate;
};

export default useFilteredBlocks;
