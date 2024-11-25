// TablesList.js
import React, { useState, useEffect } from 'react';
import './css/tableList.css';
import useApi from '../../../Hooks/useApi';

const TablesList = () => {
  const api = useApi();
  const [tables, setTables] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
  const handleInputChange = (id, field, value) => {
    setTables((prevTables) =>
      prevTables.map((table) => (table.id === id ? { ...table, [field]: value } : table))
    );
  };

  // Save changes to API
  const handleSave = async (table) => {
    try {
      if (table._id) {
        // Existing table, use PUT
        await api.put(`${window.baseDomain}api/tables/${table._id}`, table);
      } else {
        // New table, use POST
        await api.post(`${window.baseDomain}api/tables`, table);
      }
      // Optionally, show a success message
    } catch (error) {
      console.error('Error saving table:', error);
      // Optionally, show an error message
    }
  };

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
            <th>Min. Capaciteit</th>
            <th>Max. Capaciteit</th>
            <th>Vorm</th>
            <th>Prioriteit</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td>
                <input
                  type="text"
                  value={table.tableNumber || ''}
                  onChange={(e) => handleInputChange(table.id, 'tableNumber', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={table.name || ''}
                  onChange={(e) => handleInputChange(table.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={table.minCapacity || ''}
                  onChange={(e) => handleInputChange(table.id, 'minCapacity', parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={table.maxCapacity || ''}
                  onChange={(e) => handleInputChange(table.id, 'maxCapacity', parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <select
                  value={table.shape || ''}
                  onChange={(e) => handleInputChange(table.id, 'shape', e.target.value)}
                >
                  <option value="">Selecteer Vorm</option>
                  <option value="rond">Rond</option>
                  <option value="vierkant">Vierkant</option>
                  <option value="metStoelen">Met Stoelen</option>
                </select>
              </td>
              <td>
                <select
                  value={table.priority || ''}
                  onChange={(e) => handleInputChange(table.id, 'priority', e.target.value)}
                >
                  <option value="">Selecteer Prioriteit</option>
                  <option value="metVoorangInvullen">Met Voorrang Invullen</option>
                  <option value="snellerInvullen">Sneller Invullen</option>
                  <option value="tragerInvullen">Trager Invullen</option>
                  <option value="alsLaatsteIndelen">Als Laatste Indelen</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleSave(table)}>Opslaan</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="tables-list-title">Tafelgroepen</h2>
      <table className="table-groups-list">
        <thead>
          <tr>
            <th>Groep ID</th>
            <th>Van Tafel</th>
            <th>Naar Tafel</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id}>
              <td>{line.id}</td>
              <td>{line.from}</td>
              <td>{line.to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablesList;
