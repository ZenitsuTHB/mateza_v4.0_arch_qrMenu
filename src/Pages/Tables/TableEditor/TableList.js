// TablesList.js
import React, { useState, useEffect } from 'react';
import './css/tableList.css';
import useApi from '../../../Hooks/useApi';
import useNotification from '../../../Components/Notification';
import { FaEllipsisV } from 'react-icons/fa';

const TablesList = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification(); // Initialize notification hook

  const [tables, setTables] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [openTooltipTableId, setOpenTooltipTableId] = useState(null);
  const [openTooltipLineId, setOpenTooltipLineId] = useState(null);

  useEffect(() => {
    const fetchTablesAndLines = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/tables`, { noCache: true });
        if (Array.isArray(data)) {
          const elementsData = data.filter((item) => item.type !== 'line');
          const linesData = data.filter((item) => item.type === 'line');
          setTables(elementsData);
          setLines(linesData);
        } else if (data && Array.isArray(data.tables)) {
          const elementsData = data.tables.filter((item) => item.type !== 'line');
          const linesData = data.tables.filter((item) => item.type === 'line');
          setTables(elementsData);
          setLines(linesData);
        } else {
          setTables([]);
          setLines([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchTablesAndLines();
  }, [api]);

  // Handle changes to table fields
  const handleTableInputChange = (id, field, value) => {
    setTables((prevTables) =>
      prevTables.map((table) => (table.id === id ? { ...table, [field]: value } : table))
    );
  };

  // Handle changes to line fields
  const handleLineInputChange = (id, field, value) => {
    setLines((prevLines) =>
      prevLines.map((line) => (line.id === id ? { ...line, [field]: value } : line))
    );
  };

  // Handle deletion of a table and related tafelgroepen
  const handleDeleteTable = async (table) => {
    try {
      if (table._id) {
        // Delete the table
        await api.delete(`${window.baseDomain}api/tables/${table._id}`);
        setTables((prevTables) => prevTables.filter((t) => t.id !== table.id));
        triggerNotification('Tafel succesvol verwijderd', 'success');

        // Find and delete related tafelgroepen
        const relatedLines = lines.filter(
          (line) => line.from === table.id || line.to === table.id
        );

        for (const line of relatedLines) {
          if (line._id) {
            await api.delete(`${window.baseDomain}api/tables/${line._id}`);
            setLines((prevLines) => prevLines.filter((l) => l.id !== line.id));
            triggerNotification('Gerelateerde tafelgroep succesvol verwijderd', 'success');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      triggerNotification('Fout bij het verwijderen van de tafel', 'error');
    }
  };

  // Handle deletion of a tafelgroep (line)
  const handleDeleteLine = async (line) => {
    try {
      if (line._id) {
        // Existing line, use DELETE
        await api.delete(`${window.baseDomain}api/tables/${line._id}`);
        setLines((prevLines) => prevLines.filter((l) => l.id !== line.id));
        triggerNotification('Tafelgroep succesvol verwijderd', 'success');
      }
    } catch (error) {
      console.error('Error deleting tafelgroep:', error);
      triggerNotification('Fout bij het verwijderen van de tafelgroep', 'error');
    }
  };

  // Save changes to a single table
  const handleSaveTable = async (table) => {
    try {
      if (table._id) {
        // Existing table, use PUT
        await api.put(`${window.baseDomain}api/tables/${table._id}`, table);
        triggerNotification('Tafel succesvol opgeslagen', 'success');
      } else {
        // New table, use POST
        await api.post(`${window.baseDomain}api/tables`, table);
        triggerNotification('Tafel succesvol aangemaakt', 'success');
      }
    } catch (error) {
      console.error('Error saving table:', error);
      triggerNotification('Fout bij het opslaan van de tafel', 'error');
    }
  };

  // Save changes to a single tafelgroep (line)
  const handleSaveLine = async (line) => {
    try {
      if (line._id) {
        // Existing line, use PUT
        await api.put(`${window.baseDomain}api/tables/${line._id}`, line);
        triggerNotification('Tafelgroep succesvol opgeslagen', 'success');
      } else {
        // New line, use POST
        await api.post(`${window.baseDomain}api/tables`, line);
        triggerNotification('Tafelgroep succesvol aangemaakt', 'success');
      }
    } catch (error) {
      console.error('Error saving tafelgroep:', error);
      triggerNotification('Fout bij het opslaan van de tafelgroep', 'error');
    }
  };

  // Toggle tooltip for tables
  const toggleTooltipTable = (tableId) => {
    setOpenTooltipTableId((prevId) => (prevId === tableId ? null : tableId));
  };

  // Toggle tooltip for lines
  const toggleTooltipLine = (lineId) => {
    setOpenTooltipLineId((prevId) => (prevId === lineId ? null : lineId));
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.tooltip-container') &&
        !event.target.closest('.ellipsis-icon')
      ) {
        setOpenTooltipTableId(null);
        setOpenTooltipLineId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get table options for selection boxes
  const tableOptions = tables.map((table) => ({
    value: table.id,
    label: table.name || `Tafel ${table.tableNumber}`,
  }));

  if (loading) {
    return <div>Loading tables...</div>;
  }

  if (error) {
    return <div>Error loading tables.</div>;
  }

  return (
    <div className="tables-list-page">
      <h2 className="tables-list-title">Tafeloverzicht</h2>
      <table className="tables-list">
        <thead>
          <tr>
            <th>Tafelnummer</th>
            <th>Naam</th>
            <th className="hide-on-mobile">Min. Capaciteit</th>
            <th className="hide-on-mobile">Max. Capaciteit</th>
            <th className="hide-on-mobile">Vorm</th>
            <th className="hide-on-mobile">Prioriteit</th>
            <th>Acties</th>
            <th></th> {/* Empty header for ellipsis column */}
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td>
                <input
                  type="text"
                  value={table.tableNumber || ''}
                  onChange={(e) =>
                    handleTableInputChange(table.id, 'tableNumber', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={table.name || ''}
                  onChange={(e) => handleTableInputChange(table.id, 'name', e.target.value)}
                />
              </td>
              <td className="hide-on-mobile">
                <input
                  type="number"
                  value={table.minCapacity || ''}
                  onChange={(e) =>
                    handleTableInputChange(table.id, 'minCapacity', parseInt(e.target.value, 10))
                  }
                />
              </td>
              <td className="hide-on-mobile">
                <input
                  type="number"
                  value={table.maxCapacity || ''}
                  onChange={(e) =>
                    handleTableInputChange(table.id, 'maxCapacity', parseInt(e.target.value, 10))
                  }
                />
              </td>
              <td className="hide-on-mobile">
                <select
                  value={table.shape || ''}
                  onChange={(e) => handleTableInputChange(table.id, 'shape', e.target.value)}
                >
                  <option value="">Selecteer Vorm</option>
                  <option value="rond">Rond</option>
                  <option value="vierkant">Vierkant</option>
                  <option value="metStoelen">Met Stoelen</option>
                </select>
              </td>
              <td className="hide-on-mobile">
                <select
                  value={table.priority || ''}
                  onChange={(e) =>
                    handleTableInputChange(table.id, 'priority', e.target.value)
                  }
                >
                  <option value="">Selecteer Prioriteit</option>
                  <option value="metVoorangInvullen">Met Voorrang Invullen</option>
                  <option value="snellerInvullen">Sneller Invullen</option>
                  <option value="tragerInvullen">Trager Invullen</option>
                  <option value="alsLaatsteIndelen">Als Laatste Indelen</option>
                </select>
              </td>
              <td className="actions-column">
                <button
                  className="standard-button blue"
                  onClick={() => handleSaveTable(table)}
                >
                  Opslaan
                </button>
              </td>
              <td>
                <div className="ellipsis-container">
                  <FaEllipsisV
                    className="ellipsis-icon"
                    onClick={() => toggleTooltipTable(table.id)}
                  />
                  {openTooltipTableId === table.id && (
                    <div className="tooltip-container">
                      <div
                        className="tooltip-item delete-item"
                        onClick={() => handleDeleteTable(table)}
                      >
                        Verwijderen
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Save button below the tables */}
      {/* Uncomment if you want a separate save button for all tables */}
      {/* <button className="standard-button blue" onClick={handleSaveAllTables}>
        Opslaan
      </button> */}

      <h2 className="tables-list-title">Tafelgroepen</h2>
      <table className="table-groups-list">
        <thead>
          <tr>
            <th>Van Tafel</th>
            <th>Naar Tafel</th>
            <th>Acties</th>
            <th></th> {/* Empty header for ellipsis column */}
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id}>
              <td>
                <select
                  value={line.from || ''}
                  onChange={(e) =>
                    handleLineInputChange(line.id, 'from', e.target.value)
                  }
                >
                  <option value="">Selecteer Tafel</option>
                  {tableOptions.map((table) => (
                    <option key={table.value} value={table.value}>
                      {table.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={line.to || ''}
                  onChange={(e) =>
                    handleLineInputChange(line.id, 'to', e.target.value)
                  }
                >
                  <option value="">Selecteer Tafel</option>
                  {tableOptions.map((table) => (
                    <option key={table.value} value={table.value}>
                      {table.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="actions-column">
                <button
                  className="standard-button blue"
                  onClick={() => handleSaveLine(line)}
                >
                  Opslaan
                </button>
              </td>
              <td>
                <div className="ellipsis-container">
                  <FaEllipsisV
                    className="ellipsis-icon"
                    onClick={() => toggleTooltipLine(line.id)}
                  />
                  {openTooltipLineId === line.id && (
                    <div className="tooltip-container">
                      <div
                        className="tooltip-item delete-item"
                        onClick={() => handleDeleteLine(line)}
                      >
                        Verwijderen
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Save button below the tafelgroepen */}
      {/* Uncomment if you want a separate save button for all tafelgroepen */}
      {/* <button className="standard-button blue" onClick={handleSaveAllLines}>
        Opslaan
      </button> */}

      {/* Include the NotificationComponent to display notifications */}
      <NotificationComponent />
    </div>
  );
};

export default TablesList;
