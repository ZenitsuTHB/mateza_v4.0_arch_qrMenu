// src/components/Profile/FormField.jsx

import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  error,
  placeholder,
  halfWidth,
  options = [], // New prop for select options
}) => {
  return (
    <div className={`form-group ${halfWidth ? 'half-width' : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" />}
        
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            aria-label={label}
            className={`form-control ${error ? 'input-error' : ''}`}
          >
            <option value="">Selecteer een optie</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label={label}
            className={`form-control ${error ? 'input-error' : ''}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={label}
            className={`form-control ${error ? 'input-error' : ''}`}
          />
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormField;
