// src/hooks/useFilteredBlocks.js

import { useMemo } from 'react';

const validateSelectedDate = (selectedDate) => {
  const dateObj = new Date(selectedDate);
  if (isNaN(dateObj)) {
    console.error(`--> Error: Invalid selectedDate format: ${selectedDate}`);
    return null;
  }
  console.log(`Selected Date Object: ${dateObj} (${dateObj.toISOString()})`);
  return dateObj;
};

const getDayOfWeek = (dateObj) => {
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Europe/Berlin' });
  console.log(`Day of the Week: ${dayOfWeek}`);
  return dayOfWeek;
};

const isDayEnabled = (blockDateSchema, dayOfWeek, blockIndex) => {
  const daySettings = blockDateSchema[dayOfWeek];
  if (!daySettings) {
    console.warn(`--> Warning: No settings found for ${dayOfWeek} in Block ${blockIndex + 1}.`);
    return false;
  }
  console.log(`Day Settings for ${dayOfWeek}:`, daySettings);
  const enabled = daySettings.enabled ?? false;
  console.log(`Is ${dayOfWeek} Enabled: ${enabled}`);
  return enabled;
};

const isWithinClosingPeriod = (blockDateSchema, selectedDateObj) => {
  console.log(`\n--- Checking Closing Period ---`);
  
  if (!blockDateSchema.closing || !blockDateSchema.closing.enabled) {
    console.log(`--> Closing is not enabled in the block schema.`);
    return false;
  }
  console.log(`--> Closing is enabled.`);

  const { startDate, endDate } = blockDateSchema.closing;
  console.log(`--> Closing Start Date (raw): ${startDate}`);
  console.log(`--> Closing End Date (raw): ${endDate}`);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isNaN(end)) {
    end.setHours(23, 59, 59, 999);
    console.log(`--> Adjusted Closing End Date to end of day: ${end.toISOString()}`);
  }
  
  if (isNaN(start) || isNaN(end)) {
    console.warn(`--> Warning: Closing period has invalid date(s); unable to check range.`);
    return false;
  }

  const within = selectedDateObj >= start && selectedDateObj <= end;
  console.log(`--> Selected Date: ${selectedDateObj.toISOString()}`);
  console.log(`--> Is Selected Date within Closing Period? ${within}`);
  
  return within;
};

const isWithinPeriod = (blockDateSchema, selectedDateObj) => {
  console.log(`\n--- Checking Period ---`);

  if (!blockDateSchema.period || !blockDateSchema.period.enabled) {
    console.log(`--> Period is not enabled or does not exist in the block schema.`);
    return true;
  }
  console.log(`--> Period is enabled.`);

  const { startDate, endDate } = blockDateSchema.period;
  console.log(`--> Period Start Date (raw): ${startDate}`);
  console.log(`--> Period End Date (raw): ${endDate}`);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isNaN(end)) {
    end.setHours(23, 59, 59, 999);
    console.log(`--> Adjusted Period End Date to end of day: ${end.toISOString()}`);
  }

  if (isNaN(start) || isNaN(end)) {
    console.warn(`--> Warning: Period has invalid date(s); unable to check range.`);
    return false;
  }

  const within = selectedDateObj >= start && selectedDateObj <= end;
  console.log(`--> Selected Date: ${selectedDateObj.toISOString()}`);
  console.log(`--> Is Selected Date within Period? ${within}`);

  return within;
};

const shouldIncludeBlock = (block, dateKey, selectedDateObj, blockIndex) => {
  const blockDate = block.date;
  const blockDateSchema = block.schemaSettings;

  console.log(`\n--- Processing Block ${blockIndex + 1} ---`);
  console.log(`Block Date: ${blockDate}`);
  console.log(`Block Schema Settings:`, blockDateSchema);

  if (!blockDateSchema) {
    console.warn(`--> Warning: block.schemaSettings is undefined for Block ${blockIndex + 1}. Skipping this block.`);
    return false;
  }

  const withinClosing = isWithinClosingPeriod(blockDateSchema, selectedDateObj);
  if (withinClosing) {
    if (blockDate === dateKey) {
      console.log(`--> Within closing period and block.date matches selectedDate. Adding to blocksForSelectedDate.`);
      return true;
    } else {
      console.log(`--> Within closing period but block.date does not match selectedDate. Excluding block.`);
      return false;
    }
  }

  const withinPeriod = isWithinPeriod(blockDateSchema, selectedDateObj);
  if (!withinPeriod && blockDate !== dateKey) {
    console.log(`--> Outside of enabled period and block.date does not match selectedDate. Excluding block.`);
    return false;
  }

  if (blockDate === dateKey) {
    console.log(`--> Block date matches the selected date. Adding to blocksForSelectedDate.`);
    return true;
  } else {
    const dayOfWeek = getDayOfWeek(selectedDateObj);
    const enabled = isDayEnabled(blockDateSchema, dayOfWeek, blockIndex);
    if (enabled) {
      console.log(`--> Day is enabled. Adding block to blocksForSelectedDate.`);
      return true;
    } else {
      console.log(`--> Day is not enabled. Block not added.`);
      return false;
    }
  }
};

const useFilteredBlocks = (blocks, selectedDate, formatDateKey) => {
  const blocksForSelectedDate = useMemo(() => {
    const dateKey = formatDateKey(selectedDate);
    const filteredBlocks = [];

    console.log(`\n--- Processing Selected Date in useFilteredBlocks ---`);
    console.log(`Selected Date: ${selectedDate}`);
    console.log(`Formatted Date Key: ${dateKey}`);

    const selectedDateObj = validateSelectedDate(selectedDate);
    if (!selectedDateObj) {
      return filteredBlocks;
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const include = shouldIncludeBlock(block, dateKey, selectedDateObj, i);
      if (include) {
        filteredBlocks.push(block);
      }
    }

    console.log(`\n--- Final Blocks for Selected Date in useFilteredBlocks ---`);
    console.log(filteredBlocks);

    return filteredBlocks;
  }, [blocks, selectedDate, formatDateKey]);

  return blocksForSelectedDate;
};

export default useFilteredBlocks;
