import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const enabled = schemeSettings[item.id]?.enabled || false;

  return (
    <div
      key={item.id}
      className={`scheme-item ${item.type !== 'day' ? 'scheme-item-special' : ''}`}
    >
      <ToggleSwitch
        checked={enabled}
        onChange={() => handleToggle(item.id)}
        label={item.label}
      />

      <AnimatePresence>
        {enabled && (
          <motion.div
            className="time-inputs-container"
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
          </motion.div>
        )}
      </AnimatePresence>

      {enabled && item.type === 'day' && (
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
    </div>
  );
};

export default SchemeItem;
