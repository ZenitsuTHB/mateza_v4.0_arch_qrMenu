// src/components/TablePlanCreator.jsx

import React from 'react';
import FloorPlan from './FloorPlan';
import Sidebar from './Sidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './css/tablePlanCreator.css'; // Correct path with lowerCamelCase

const TablePlanCreator = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-plan-creator">
        <FloorPlan />
        <Sidebar />
      </div>
    </DndProvider>
  );
};

export default TablePlanCreator;
