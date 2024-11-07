import React from 'react';
import FloorPlan from './FloorPlan';
import Sidebar from './Sidebar';
import './css/tablePlanCreator.css'; // Ensure correct path

const TablePlanCreator = () => {
  return (
    <div className="table-plan-creator">
      <FloorPlan />
      <Sidebar />
    </div>
  );
};

export default TablePlanCreator;
