// src/Pages/Uitzonderingen/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/exceptions.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import ExceptionForm from './ExceptionForm';
import ExceptionList from './ExceptionList';
import ExceptionCalendar from './ExceptionCalendar';  // Import the new component
import ExceptionTabs from './ExceptionTabs';          // Import the new component
import ExceptionItem from './ExceptionItem';          // Import the new component

const Uitzonderingen = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of exceptions
  const [exceptions, setExceptions] = useState([]);
  const [filteredExceptions, setFilteredExceptions] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedDateExceptions, setSelectedDateExceptions] = useState([]);

  // Fetch the exceptions at component mount
  useEffect(() => {
    const fetchExceptions = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/uitzonderingen', { noCache: true });
        if (Array.isArray(data)) {
          setExceptions(data);
        } else {
          setExceptions([]);
        }
      } catch (error) {
        console.error('Error fetching exceptions:', error);
        setExceptions([]);
        triggerNotification('Fout bij het ophalen van uitzonderingen.', 'error');
      }
    };
    fetchExceptions();
  }, [api, triggerNotification]);

  // Filter exceptions based on the active tab
  useEffect(() => {
    const filterExceptionsByTab = () => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const nextMonth = (currentMonth + 1) % 12;

      let filtered = [];

      exceptions.forEach((exception) => {
        const startDate = new Date(exception.startDate);
        const endDate = new Date(exception.endDate);

        switch (activeTab) {
          case 'current':
            if (startDate.getMonth() === currentMonth || endDate.getMonth() === currentMonth) {
              filtered.push(exception);
            }
            break;
          case 'next':
            if (startDate.getMonth() === nextMonth || endDate.getMonth() === nextMonth) {
              filtered.push(exception);
            }
            break;
          case 'all':
          default:
            filtered.push(exception);
            break;
        }
      });

      setFilteredExceptions(filtered);
    };

    filterExceptionsByTab();
  }, [exceptions, activeTab]);

  // Handler to refresh exceptions
  const refreshExceptions = async () => {
    try {
      const data = await api.get(window.baseDomain + 'api/uitzonderingen', { noCache: true });
      if (Array.isArray(data)) {
        setExceptions(data);
      } else {
        setExceptions([]);
      }
    } catch (error) {
      console.error('Error fetching exceptions:', error);
      setExceptions([]);
      triggerNotification('Fout bij het ophalen van uitzonderingen.', 'error');
    }
  };

  // Handle date click in calendar
  const handleDateClick = (date) => {
    const clickedDate = new Date(date);
    const overlappingExceptions = exceptions.filter((exception) => {
      const startDate = new Date(exception.startDate);
      const endDate = new Date(exception.endDate);
      return clickedDate >= startDate && clickedDate <= endDate;
    });
    setSelectedDateExceptions(overlappingExceptions);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedDateExceptions([]);
  };

  return (
    <div className="exceptions-page">
      <NotificationComponent />
      <div className="exceptions-page__container">
        <ExceptionForm
          api={api}
          triggerNotification={triggerNotification}
          refreshExceptions={refreshExceptions}
        />
        <div className="exceptions-page__content">
          <ExceptionCalendar
            exceptions={exceptions}
            onDateClick={handleDateClick}
            activeTab={activeTab}
          />
          <ExceptionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          {selectedDateExceptions.length > 0 && (
            <div className="exceptions-page__selected-date-exceptions">
              <h3>Uitzonderingen op geselecteerde datum:</h3>
              {selectedDateExceptions.map((exception) => (
                <ExceptionItem
                  key={exception._id}
                  exception={exception}
                  api={api}
                  triggerNotification={triggerNotification}
                  refreshExceptions={refreshExceptions}
                />
              ))}
            </div>
          )}
          <ExceptionList
            exceptions={filteredExceptions}
            api={api}
            triggerNotification={triggerNotification}
            refreshExceptions={refreshExceptions}
          />
        </div>
      </div>
    </div>
  );
};

export default withHeader(Uitzonderingen);
