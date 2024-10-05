import React, { useState, useEffect, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/style.css';

const Notepad = () => {
  const [note, setNote] = useState(localStorage.getItem('notepadNote') || '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = note;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notepadNote', note);
  }, [note]);

  const handleKeyDown = (e) => {
    if (e.key === 'b' && e.ctrlKey) {
      document.execCommand('bold');
      e.preventDefault();
    } else if (e.key === 'i' && e.ctrlKey) {
      document.execCommand('italic');
      e.preventDefault();
    } else if (e.key === 'u' && e.ctrlKey) {
      document.execCommand('underline');
      e.preventDefault();
    } else if (e.key === 'Enter') {
      setTimeout(() => {
        document.execCommand('formatBlock', false, 'div');
      }, 0);
    }
  };

  const handleInputChange = (e) => {
    const editor = editorRef.current;
    const text = editor.innerHTML;
    setNote(text);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer;

      let blockNode = node;
      while (blockNode && blockNode !== editor && !['P', 'DIV', 'H1', 'H2', 'H3'].includes(blockNode.nodeName)) {
        blockNode = blockNode.parentNode;
      }

      if (blockNode && blockNode !== editor) {
        let blockText = blockNode.textContent;
        const lastThreeChars = blockText.slice(-3);

        if (lastThreeChars === '#h1' || lastThreeChars === '#h2' || lastThreeChars === '#h3') {
          blockText = blockText.slice(0, -3);
          blockNode.textContent = blockText;

          const format = lastThreeChars === '#h1' ? 'h1' : lastThreeChars === '#h2' ? 'h2' : 'h3';
          document.execCommand('formatBlock', false, format);

          const newRange = document.createRange();
          newRange.setStart(blockNode, blockNode.childNodes.length);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
  };

  return (
    <div className="notepad-container">
      <div
        ref={editorRef}
        className="notepad-textarea"
        contentEditable
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Begin met typen...\nTip: gebruik #h1, #h2 of h3 in het begin van een zin voor titels"
        style={{
          minHeight: '300px',
          padding: '10px',
          direction: 'ltr',
          textAlign: 'left',
          color: note === '' ? 'lightgray' : 'black',
        }}
      >
        {note === '' ? 'Begin met typen...\nTip: gebruik #h1, #h2 of h3 in het begin van een zin voor titels' : ''}</div>
    </div>
  );
};

export default withHeader(Notepad);