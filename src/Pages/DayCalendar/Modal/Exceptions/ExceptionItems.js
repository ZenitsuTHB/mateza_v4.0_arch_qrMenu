// src/components/Modal/ExceptionItem.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateDutch = (date) => {
	if (!date) return '';

	const months = [
	  'januari',
	  'februari',
	  'maart',
	  'april',
	  'mei',
	  'juni',
	  'juli',
	  'augustus',
	  'september',
	  'oktober',
	  'november',
	  'december',
	];
  
	const dayNumber = date.getDate();
	const monthName = months[date.getMonth()];
	const year = date.getFullYear();
  
	return `${dayNumber} ${monthName} ${year}`;
  };
  

  const ExceptionItem = ({
	type,
	item,
	index,
	handleToggle,
	handleInputChange,
  }) => {
  
	// Determine the label based on the type and selected dates
	let label = '';
	if (type === 'sluitingsperiode') {
	  if (item.startDate && item.endDate) {
		label = `${formatDateDutch(new Date(item.startDate))} - ${formatDateDutch(
		  new Date(item.endDate)
		)}`;
	  } else {
		label = `Periode ${index + 1}`;
	  }
	} else if (type === 'sluitingsdag') {
	  if (item.date) {
		label = `${formatDateDutch(new Date(item.date))}`;
	  } else {
		label = `Dag ${index + 1}`;
	  }
	} else if (type === 'uitzonderlijkeOpeningsuren') {
	  if (item.date && item.startTime && item.endTime) {
		label = `${formatDateDutch(new Date(item.date))} - (${item.startTime} - ${item.endTime})`;
	  } else {
		label = `Uur ${index + 1}`;
	  }
	}
  
	return (
	  <div className="exceptional-day-item">
		<div className="day-header">
		  <span className={`day-label ${!item.enabled ? 'disabled' : ''}`}>
			{label}
		  </span>
		  <label className="switch">
			<input
			  type="checkbox"
			  checked={item.enabled}
			  onChange={() => handleToggle(type, index)}
			/>
			<span className="slider round"></span>
		  </label>
		</div>
		<AnimatePresence>
		  {item.enabled && (
			<motion.div
			  className="inputs-container"
			  initial={{ height: 0, opacity: 0 }}
			  animate={{ height: 'auto', opacity: 1 }}
			  exit={{ height: 0, opacity: 0 }}
			  transition={{ duration: 0.3 }}
			  layout
			>
			  {type === 'sluitingsperiode' && (
				<>
				  <label className="modal-label date-input">
					Start datum:
					<input
					  type="date"
					  value={item.startDate}
					  onChange={(e) =>
						handleInputChange(
						  type,
						  index,
						  'startDate',
						  e.target.value
						)
					  }
					  required
					/>
				  </label>
				  <label className="modal-label date-input">
					Eind datum:
					<input
					  type="date"
					  value={item.endDate}
					  onChange={(e) =>
						handleInputChange(
						  type,
						  index,
						  'endDate',
						  e.target.value
						)
					  }
					  required
					/>
				  </label>
				</>
			  )}
			  {type === 'sluitingsdag' && (
				<label className="modal-label date-input">
				  Datum:
				  <input
					type="date"
					value={item.date}
					onChange={(e) =>
					  handleInputChange(type, index, 'date', e.target.value)
					}
					required
				  />
				</label>
			  )}
			  {type === 'uitzonderlijkeOpeningsuren' && (
				<>
				  <label className="modal-label date-input">
					Datum:
					<input
					  type="date"
					  value={item.date}
					  onChange={(e) =>
						handleInputChange(type, index, 'date', e.target.value)
					  }
					  required
					/>
				  </label>
				  <label className="modal-label time-input">
					Start tijd:
					<input
					  type="time"
					  value={item.startTime}
					  onChange={(e) =>
						handleInputChange(
						  type,
						  index,
						  'startTime',
						  e.target.value
						)
					  }
					  required
					/>
				  </label>
				  <label className="modal-label time-input">
					Eindtijd:
					<input
					  type="time"
					  value={item.endTime}
					  onChange={(e) =>
						handleInputChange(
						  type,
						  index,
						  'endTime',
						  e.target.value
						)
					  }
					  required
					/>
				  </label>
				</>
			  )}
			</motion.div>
		  )}
		</AnimatePresence>
	  </div>
	);
  };
  
  export default ExceptionItem;