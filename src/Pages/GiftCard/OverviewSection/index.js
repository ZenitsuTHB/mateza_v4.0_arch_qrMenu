// OverviewSectionFlex.js

import React, { useState, useEffect } from 'react';
import './css/overviewSection.css'; // Consolidated CSS file
import SearchBar from './SearchBar'; // Import the SearchBar component
import {
  FaSortUp,
  FaSortDown,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

// Mock data for gift cards
const mockGiftCards = [
  {
    id: 1,
    status: 'Unused',
    customer: 'John Doe',
    initialValue: 100,
    expirationDate: '2025-12-31',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    status: 'Used',
    customer: 'Jane Smith',
    initialValue: 50,
    expirationDate: '2024-06-30',
    email: 'jane.smith@example.com',
  },
  {
    id: 3,
    status: 'Unused',
    customer: 'Alice Johnson',
    initialValue: 75,
    expirationDate: '2025-03-15',
    email: 'alice.johnson@example.com',
  },
  {
    id: 4,
    status: 'Used',
    customer: 'Bob Brown',
    initialValue: 200,
    expirationDate: '2023-11-20',
    email: 'bob.brown@example.com',
  },
  {
    id: 5,
    status: 'Unused',
    customer: 'Charlie Davis',
    initialValue: 150,
    expirationDate: '2024-08-10',
    email: 'charlie.davis@example.com',
  },
  // ... more mock data
];

const OverviewSectionFlex = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [amountSearch, setAmountSearch] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // In a real application, fetch data from API
    setGiftCards(mockGiftCards);
  }, []);

  // Handle sorting
  const handleSort = (column) => {
    if (sortedColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort gift cards based on sortedColumn and sortDirection
  const sortedGiftCards = [...giftCards].sort((a, b) => {
    if (!sortedColumn) return 0;
    let aVal = a[sortedColumn];
    let bVal = b[sortedColumn];

    // If sorting by initialValue, ensure numeric comparison
    if (sortedColumn === 'initialValue') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    } else {
      // For other fields, convert to lowercase string for comparison
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter gift cards based on search queries
  const filteredGiftCards = sortedGiftCards.filter((card) => {
    const matchesCustomer = card.customer.toLowerCase().includes(customerSearch.toLowerCase());
    const matchesEmail = card.email.toLowerCase().includes(emailSearch.toLowerCase());
    const matchesAmount =
      amountSearch === '' || card.initialValue.toString().includes(amountSearch);

    return matchesCustomer && matchesEmail && matchesAmount;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredGiftCards.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGiftCards = filteredGiftCards.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Handle Export to CSV
  const handleExport = () => {
    const headers = ['Status', 'Klant', 'Initieel Bedrag (€)', 'Vervaldatum', 'E-mailadres'];
    const rows = filteredGiftCards.map((card) => [
      card.status,
      card.customer,
      card.initialValue,
      card.expirationDate,
      card.email,
    ]);

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cadeaubonnen.csv'); // Vertaalde bestandsnaam
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  // Render sort icon based on current sort state
  const renderSortIcon = (column) => {
    if (sortedColumn !== column) {
      return <FaSort />;
    }
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="overview-section">
      <h2 className="overview-section__title">Cadeaubon Lijst</h2>

      {/* Search Bars */}
      <div className="search-bars-container">
        <SearchBar
          placeholder="Zoeken op klant"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="search-bar"
        />
        <SearchBar
          placeholder="Zoeken op email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          className="search-bar"
        />
        <SearchBar
          placeholder="Zoeken op bedrag"
          value={amountSearch}
          onChange={(e) => setAmountSearch(e.target.value)}
          className="search-bar"
        />
      </div>      

      <div className="overview-section__table-container">
        <table className="overview-section__table">
          <thead>
            <tr className="table-header-row">
              <th
                onClick={() => handleSort('status')}
                style={{
                  width: '20%',
                }}
              >
                Status {renderSortIcon('status')}
              </th>
              <th onClick={() => handleSort('customer')}>
                Klant {renderSortIcon('customer')}
              </th>
              <th onClick={() => handleSort('initialValue')}>
                Initieel Bedrag (€) {renderSortIcon('initialValue')}
              </th>
              <th onClick={() => handleSort('expirationDate')}>
                Vervaldatum {renderSortIcon('expirationDate')}
              </th>
              <th onClick={() => handleSort('email')}>
                E-mailadres {renderSortIcon('email')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentGiftCards.length > 0 ? (
              currentGiftCards.map((card) => (
                <tr key={card.id} className="table-body-row">
                  <td>
                    <span
                      className={
                        card.status === 'Used'
                          ? 'status status--used'
                          : 'status status--unused'
                      }
                    >
                      {card.status}
                    </span>
                  </td>
                  <td>{card.customer}</td>
                  <td>€{card.initialValue.toFixed(2)}</td>
                  <td>{card.expirationDate}</td>
                  <td>{card.email}</td>
                </tr>
              ))
            ) : (
              <tr className="no-data-row">
                <td colSpan="5" className="no-data">
                  Geen cadeaubonnen gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="overview-section__pagination">
        <div className="pagination__info">
          Pagina {currentPage} van {totalPages}
        </div>
        <div className="pagination__controls">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="pagination__button"
            title="Eerste Pagina"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="pagination__button"
            title="Vorige Pagina"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="pagination__button"
            title="Volgende Pagina"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="pagination__button"
            title="Laatste Pagina"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
		<div className="export-button-container">
        <button className="button-style-3 button-export" onClick={handleExport}>
          Exporteer naar CSV
        </button>
      </div>
      </div>
    </div>
  );
};

export default OverviewSectionFlex;
