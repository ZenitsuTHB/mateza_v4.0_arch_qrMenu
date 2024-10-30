import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShiftItem from './ShiftItem';
import ToggleSwitch from './ToggleSwitch';

const Shifts = ({
  itemId,
  schemeSettings,
  handleShiftsToggle,
  handleShiftInputChange,
  addShift,
  removeShift,
  errors,
  isSaveAttempted,
}) => {
  const shiftsEnabled = schemeSettings[itemId]?.shiftsEnabled || false;
  const shifts = schemeSettings[itemId]?.shifts || [];

  return (
    <>
      <ToggleSwitch
        checked={shiftsEnabled}
        onChange={() => handleShiftsToggle(itemId)}
        label="Shifts aanzetten"
      />

      <AnimatePresence>
        {shiftsEnabled && (
          <motion.div
            className="shifts-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {shifts.map((shift, shiftIndex) => (
              <ShiftItem
                key={shiftIndex}
                shift={shift}
                shiftIndex={shiftIndex}
                itemId={itemId}
                handleShiftInputChange={handleShiftInputChange}
                removeShift={removeShift}
                errors={errors ? errors[shiftIndex] : {}}
                isSaveAttempted={isSaveAttempted}
              />
            ))}

            {/* Add Shift Button */}
            <button
              type="button"
              className="add-shift-button"
              onClick={() => addShift(itemId)}
            >
              + Voeg Shift Toe
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shifts;
