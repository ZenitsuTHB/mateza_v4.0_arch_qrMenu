import React from 'react';
import ReservationStepOne from './StepOne';
import ReservationStepTwo from './ReservationStepTwo';
import ReservationSummary from './ReservationSummary';
import { FaTimes } from 'react-icons/fa';
import './css/reservationSidebar.css';

const ReservationSidebar = ({
  isOpen,
  onClose,
  formData,
  errors,
  handleChange,
  handleFinalSubmit,
  setFormData,
  isSubmitting,
  reservationSubmitted,
  onNewReservation,
}) => {
  return (
    <div className={`reservation-sidebar-component ${isOpen ? 'open' : ''}`}>
      <div className="reservation-sidebar-content">
        <h2 className='admin-title'>Admin Reservaties</h2>

        <button className="close-sidebar-button" onClick={onClose}>
          <FaTimes size={20} color="#000" />
        </button>
        {reservationSubmitted ? (
          <ReservationSummary
            formData={formData}
            onNewReservation={() => {
              setFormData({
                guests: '',
                date: '',
                time: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                extraInfo: '',
                notes: '',
              });
              onNewReservation();
            }}
          />
        ) : (
          <>
            <div className="sidebar-section-one">
              <ReservationStepOne
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            </div>
            <div className="sidebar-section-two">
              <ReservationStepTwo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="reservation-footer">
              <button
                type="button"
                className="store-reservation-button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationSidebar;
