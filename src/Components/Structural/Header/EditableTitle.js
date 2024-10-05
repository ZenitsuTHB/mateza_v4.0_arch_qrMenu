import React, { useState, useEffect, useRef } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './css/style.css';

const EditableTitle = ({ title, setTitle }) => {
  const titleRef = useRef(null);
  const editIconId = useRef(uuidv4());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerText = title;
    }
  }, [title]);

  const handleTitleBlur = () => {
    setIsEditing(false);
    localStorage.setItem(`headerTitle_${title}`, title);
  };

  const handleInputChange = (e) => {
    if (titleRef.current) {
      if (e.inputType === 'insertParagraph') {
        e.preventDefault();
        return;
      }
      if (titleRef.current.innerText.length > 15) {
        titleRef.current.innerText = titleRef.current.innerText.substring(0, 15);
      }
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const cursorPosition = range.startOffset;
      setTitle(titleRef.current.innerText);
      setIsEditing(true);

      // Hide the edit icon after first character change
      const editIcon = document.getElementById(editIconId.current);
      if (editIcon) {
        editIcon.style.visibility = 'hidden';
      }

      setTimeout(() => {
        const newRange = document.createRange();
        if (titleRef.current.childNodes.length > 0) {
          newRange.setStart(titleRef.current.childNodes[0], Math.min(cursorPosition, titleRef.current.childNodes[0].length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }, 0);
    }
  };

  const handleEditClick = () => {
    if (titleRef.current) {
      titleRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(titleRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div
      className="title-container"
      onMouseEnter={() => {
        if (!isEditing) {
          const editIcon = document.getElementById(editIconId.current);
          if (editIcon) {
            editIcon.style.visibility = 'visible';
          }
        }
      }}
      onMouseLeave={() => {
        const editIcon = document.getElementById(editIconId.current);
        if (editIcon) {
          editIcon.style.visibility = 'hidden';
        }
      }}
    >
      <h1
        ref={titleRef}
        className="title"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInputChange}
        onBlur={handleTitleBlur}
        style={{ display: 'inline-block', marginRight: '8px' }}
      >
        {title}
      </h1>
      <FaPencilAlt
        id={editIconId.current}
        style={{ cursor: 'pointer', color: 'black', visibility: 'hidden', fontSize: '1.5rem' }}
        onClick={handleEditClick}
      />
    </div>
  );
};

export default EditableTitle;