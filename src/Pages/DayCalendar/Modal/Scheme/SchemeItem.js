// SchemeItem.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import Shifts from './Shifts';
import ToggleSwitch from './ToggleSwitch';

const SchemeItem = ({
  item,
  schemeSettings,
  handleToggle,
  handleInputChange,
  errors,
  isSaveAttempted,
  handleShiftsToggle,
  handleShiftInputChange,
  addShift,
  removeShift,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const enabled = schemeSettings[item.id]?.enabled || false;

  // Expand when enabled is set to true
  useEffect(() => {
    if (enabled) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [enabled]);

  return (
    <div
      key={item.id}
      className={`scheme-item ${item.type !== 'day' ? 'scheme-item-special' : ''}`}
    >
      {/* Make the whole header clickable */}
      <div
        className={`item-header ${isExpanded ? 'expanded' : ''}`}
        onClick={enabled ? () => setIsExpanded(!isExpanded) : null}
      >
        <div className={`item-label ${!enabled ? 'disabled' : ''}`}>
          {/* Conditionally render the chevron icon when enabled */}
          {enabled && (
            <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
          )}
          {item.label}
        </div>
        {/* ToggleSwitch remains on the right and stops event propagation */}
        <div onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={() => handleToggle(item.id)} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && enabled && (
          <motion.div
            className="item-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {item.type === 'day' ? (
              <>
                <label className="modal-label time-input">
                  Start tijd:
                  <input
                    type="time"
                    name={`startTime-${item.id}`}
                    value={schemeSettings[item.id]?.startTime || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, 'startTime', e.target.value)
                    }
                    required
                  />
                </label>
                <label className="modal-label time-input">
                  Eindtijd:
                  <input
                    type="time"
                    name={`endTime-${item.id}`}
                    value={schemeSettings[item.id]?.endTime || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, 'endTime', e.target.value)
                    }
                    required
                  />
                </label>
                {isSaveAttempted &&
                  errors[item.id] &&
                  Object.values(errors[item.id])
                    .filter((error) => typeof error === 'string')
                    .map((errorMsg, index) => (
                      <span key={index} className="error-shifts">
                        {errorMsg}
                      </span>
                    ))}
              </>
            ) : (
              <>
                <label className="modal-label date-input">
                  Start datum:
                  <input
                    type="date"
                    name={`startDate-${item.id}`}
                    value={schemeSettings[item.id]?.startDate || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, 'startDate', e.target.value)
                    }
                    required
                  />
                </label>
                <label className="modal-label date-input">
                  Eind datum:
                  <input
                    type="date"
                    name={`endDate-${item.id}`}
                    value={schemeSettings[item.id]?.endDate || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, 'endDate', e.target.value)
                    }
                    required
                  />
                </label>
                {isSaveAttempted &&
                  errors[item.id] &&
                  Object.values(errors[item.id]).map((errorMsg, index) => (
                    <span key={index} className="error-shifts">
                      {errorMsg}
                    </span>
                  ))}
              </>
            )}

            {/* Render Shifts component if enabled and item type is 'day' */}
            {item.type === 'day' && (
              <Shifts
                itemId={item.id}
                schemeSettings={schemeSettings}
                handleShiftsToggle={handleShiftsToggle}
                handleShiftInputChange={handleShiftInputChange}
                addShift={addShift}
                removeShift={removeShift}
                errors={errors[item.id]?.shifts}
                isSaveAttempted={isSaveAttempted}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemeItem;
