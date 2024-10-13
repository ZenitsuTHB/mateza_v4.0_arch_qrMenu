// src/components/NewReservation/StepOne.jsx

import React from 'react';

const StepOne = ({
  title,
  formData,
  handleChange,
  setCurrentStep,
  fields,
}) => {
  const stepFields = fields.filter(
    (field) =>
      field.id === 'datum' ||
      field.id === 'tijd' ||
      field.id === 'aantalPersonen'
  );

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <form className="reservation-form" onSubmit={handleNext}>
      <h2>{title}</h2>
      <h3 className="subtitle">Stap 1/3</h3>

      {stepFields.map((field) => (
        <div className="form-group" key={field.id}>
          <label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder || ''}
            ></textarea>
          ) : (
            <input
              type={field.type === 'input' ? 'text' : field.type}
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder || ''}
              min={field.min || undefined}
            />
          )}
        </div>
      ))}

      <button type="submit" className="submit-button">
        Volgende
      </button>
    </form>
  );
};

export default StepOne;
