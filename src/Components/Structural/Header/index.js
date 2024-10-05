import React, { useState, useEffect, useRef } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import './css/style.css';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const localStorageKey = `headerTitle_${WrappedComponent.name}`;

    const [title, setTitle] = useState(props.title);
    const titleRef = useRef(null);

    useEffect(() => {
      const storedTitle = localStorage.getItem(localStorageKey);
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }, [localStorageKey]);

    useEffect(() => {
      if (titleRef.current) {
        titleRef.current.innerText = title;
      }
    }, [title]);

    const handleTitleBlur = () => {
      localStorage.setItem(localStorageKey, title);
    };

    const handleInputChange = () => {
      if (titleRef.current) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const cursorPosition = range.startOffset;
        setTitle(titleRef.current.innerText);
        setTimeout(() => {
          const newRange = document.createRange();
          newRange.setStart(titleRef.current.childNodes[0], cursorPosition);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
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
      <div className="withHeader">
        <div
          className="title-container"
          onMouseEnter={() => {
            const editIcon = document.querySelector('.edit-icon');
            if (editIcon) {
              editIcon.style.visibility = 'visible';
            }
          }}
          onMouseLeave={() => {
            const editIcon = document.querySelector('.edit-icon');
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
            className="edit-icon"
            style={{ cursor: 'pointer', color: 'black', visibility: 'hidden', fontSize: '1.5rem' }}
            onClick={handleEditClick}
          />
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };