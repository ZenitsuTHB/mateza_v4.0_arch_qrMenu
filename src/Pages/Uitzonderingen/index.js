// src/Pages/Uitzonderingen/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/exceptions.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import ExceptionForm from './ExceptionForm';
import ExceptionList from './ExceptionList';

const Uitzonderingen = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of exceptions
  const [exceptions, setExceptions] = useState([]);

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

  return (
    <div className="exceptions-page">
      <NotificationComponent />
      <div className="exceptions-page__container">
        <ExceptionForm
          api={api}
          triggerNotification={triggerNotification}
          refreshExceptions={refreshExceptions}
        />
        <ExceptionList
          exceptions={exceptions}
          api={api}
          triggerNotification={triggerNotification}
          refreshExceptions={refreshExceptions}
        />
      </div>
    </div>
  );
};

export default withHeader(Uitzonderingen);
