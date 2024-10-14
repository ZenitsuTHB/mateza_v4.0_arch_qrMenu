// src/components/NewReservation/Title.jsx

import React from 'react';

const Title = ({ title, subtitle }) => {
  return (
    <>
      <h2>{title}</h2>
      <h3 className="subtitle">{subtitle}</h3>
    </>
  );
};

export default Title;
