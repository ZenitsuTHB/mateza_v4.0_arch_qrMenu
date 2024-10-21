// src/components/Modal/ExperienceSelector.jsx

import React, { useState } from 'react';

const ExperienceSelector = ({ experiences, setExperiences }) => {
  const [newExperience, setNewExperience] = useState('');

  const addExperience = () => {
    if (newExperience.trim() !== '') {
      setExperiences([...experiences, newExperience.trim()]);
      setNewExperience('');
    }
  };

  const removeExperience = (exp) => {
    setExperiences(experiences.filter((e) => e !== exp));
  };

  return (
    <div className="experience-selector">
      <label>Experiences toevoegen:</label>
      <div className="experience-list">
        {experiences.map((exp, idx) => (
          <div key={idx} className="experience-item">
            <span>{exp}</span>
            <button type="button" className="modal-delete-button" onClick={() => removeExperience(exp)}>Verwijder</button>
          </div>
        ))}
      </div>
      <div className="experience-add">
        <input
          type="text"
          placeholder="Nieuwe experience"
          value={newExperience}
          onChange={(e) => setNewExperience(e.target.value)}
        />
        <button type="button" className="modal-add-button" onClick={addExperience}>Voeg toe</button>
      </div>
    </div>
  );
};

export default ExperienceSelector;
