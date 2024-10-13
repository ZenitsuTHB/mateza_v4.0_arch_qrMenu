// src/components/NewReservation/StepTwo.jsx

import React from 'react';

const StepTwo = ({
  title,
  subtitle,
  formData,
  handleChange,
  setCurrentStep,
  fields,
}) => {
  const stepFields = fields.filter(
    (field) =>
      field.id === 'naam' ||
      field.id === 'email' ||
      field.id === 'telefoonnummer' ||
      field.id === 'opmerkingen'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log('Reserveringsgegevens:', formData);
    setCurrentStep(3);
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <h3 className="subtitle">{subtitle}</h3>

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
        Reserveren
      </button>
    </form>
  );
};

export default StepTwo;
