// src/components/DraggableComponentsList.jsx

import React from 'react';
import DraggableItem from './DraggableItem';
import './css/draggableComponentsList.css';

const componentsData = [
  // Tables
  {
    id: 'table-round-small',
    type: 'table',
    subtype: 'round',
    label: 'Round Table (1-2)',
    capacity: '1-2',
    width: 60,
    height: 60,
  },
  {
    id: 'table-round-medium',
    type: 'table',
    subtype: 'round',
    label: 'Round Table (2-6)',
    capacity: '2-6',
    width: 80,
    height: 80,
  },
  {
    id: 'table-round-large',
    type: 'table',
    subtype: 'round',
    label: 'Round Table (4-10)',
    capacity: '4-10',
    width: 120,
    height: 120,
  },
  {
    id: 'table-round-extralarge',
    type: 'table',
    subtype: 'round',
    label: 'Round Table (6-24)',
    capacity: '6-24',
    width: 160,
    height: 160,
  },
  {
    id: 'table-square-small',
    type: 'table',
    subtype: 'square',
    label: 'Square Table (1-2)',
    capacity: '1-2',
    width: 60,
    height: 60,
  },
  {
    id: 'table-square-medium',
    type: 'table',
    subtype: 'square',
    label: 'Square Table (2-6)',
    capacity: '2-6',
    width: 80,
    height: 80,
  },
  {
    id: 'table-square-large',
    type: 'table',
    subtype: 'square',
    label: 'Square Table (4-10)',
    capacity: '4-10',
    width: 120,
    height: 120,
  },
  {
    id: 'table-square-extralarge',
    type: 'table',
    subtype: 'square',
    label: 'Square Table (6-24)',
    capacity: '6-24',
    width: 160,
    height: 160,
  },
  // Walls
  {
    id: 'wall-short',
    type: 'wall',
    subtype: 'short',
    label: 'Wall Short',
    capacity: '',
    width: 100,
    height: 20,
    orientation: 'horizontal',
  },
  {
    id: 'wall-medium',
    type: 'wall',
    subtype: 'medium',
    label: 'Wall Medium',
    capacity: '',
    width: 200,
    height: 20,
    orientation: 'horizontal',
  },
  {
    id: 'wall-long',
    type: 'wall',
    subtype: 'long',
    label: 'Wall Long',
    capacity: '',
    width: 300,
    height: 20,
    orientation: 'horizontal',
  },
];

const DraggableComponentsList = ({ searchQuery }) => {
  // Filter components based on search query
  const filteredComponents = componentsData.filter((component) =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="draggable-components-list">
      {filteredComponents.length > 0 ? (
        filteredComponents.map((component) => (
          <DraggableItem key={component.id} component={component} />
        ))
      ) : (
        <p className="no-results">No components found.</p>
      )}
    </div>
  );
};

export default DraggableComponentsList;
