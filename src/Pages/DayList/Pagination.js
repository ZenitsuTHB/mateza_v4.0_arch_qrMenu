// src/components/ReservationsList/Pagination.jsx

import React from 'react';
import './css/pagination.css';

const Pagination = ({
  totalPages,
  currentPage,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="prev-button"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Vorige
      </button>
      <span className="page-numbers">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </button>
        ))}
      </span>
      <button
        className="next-button"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Volgende
      </button>
    </div>
  );
};

export default Pagination;
