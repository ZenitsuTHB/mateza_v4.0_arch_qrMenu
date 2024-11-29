import React, { useEffect, useState } from 'react';
import ReservationStepOne from './StepOne';
import ReservationStepTwoFiltering from './ReservationStepTwo';
import ReservationSummary from './ReservationSummary';
import { FaTimes } from 'react-icons/fa';
import './css/reservationSidebar.css';
import useApi from '../../Hooks/useApi';

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
  const api = useApi();
  const [timeblocks, setTimeblocks] = useState([]);
  const [loadingTimeblocks, setLoadingTimeblocks] = useState(false);
  const [timeblocksError, setTimeblocksError] = useState(null);
  const [menuData, setMenuData] = useState([]); // Add this line

  useEffect(() => {
    if (isOpen) {
      setLoadingTimeblocks(true);
      const fetchTimeblocks = async () => {
        try {
          console.log("New Reservation GET");
          const data = await api.get(`${window.baseDomain}api/auth-restaurant/`, { noCache: true });
          setTimeblocks(data.timeblocks || []);
          window.timeblocks = data.timeblocks || []; // Retain globally if needed
          const generalSettings = data['general-settings'] || {};
          window.generalSettings = generalSettings; // Retain globally
		  setMenuData(data.menu || []); // Fetch and set menu data
        } catch (err) {
          setTimeblocksError(err);
          console.error('Error fetching timeblocks:', err);
        } finally {
          setLoadingTimeblocks(false);
        }
      };
      fetchTimeblocks();
    }
  }, [isOpen, api]);

  return (
    <div className={`reservation-sidebar-component ${isOpen ? 'open' : ''}`}>
      <div className="reservation-sidebar-content">
        <h2 className='admin-title'>Admin Reservatie</h2>

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
                menu: '',
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
                timeblocks={timeblocks}
                loadingTimeblocks={loadingTimeblocks}
                timeblocksError={timeblocksError}
              />
            </div>
            <div className="sidebar-section-two">
              <ReservationStepTwoFiltering
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
				menuData={menuData} // Pass menuData to ReservationStepTwo

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
