import React from 'react';
import FloorPlan from './FloorPlan';
import Sidebar from './Sidebar';
import './css/tablePlanCreator.css'; // Import the corresponding CSS
import { withHeader } from '../../Components/Structural/Header';

const TablePlanCreator = () => {
  return (
    <div className="table-plan-creator">
      <FloorPlan />
      <Sidebar />
    </div>
  );
};

export default withHeader(TablePlanCreator);
