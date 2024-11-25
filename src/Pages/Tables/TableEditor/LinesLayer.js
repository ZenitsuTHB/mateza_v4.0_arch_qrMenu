// LinesLayer.js
import React from 'react';

const LinesLayer = ({
  elements,
  lines,
  isDrawingLine,
  startTableId,
  currentMousePosition,
}) => {
  const renderLines = () => {
    const renderedLines = [];

    // Render existing lines
    lines.forEach((line) => {
      const fromElement = elements.find((el) => el.id === line.from);
      const toElement = elements.find((el) => el.id === line.to);

      if (!fromElement || !toElement) return;

      const fromX = fromElement.x + fromElement.width / 2;
      const fromY = fromElement.y + fromElement.height / 2;
      const toX = toElement.x + toElement.width / 2;
      const toY = toElement.y + toElement.height / 2;

      const length = Math.hypot(toX - fromX, toY - fromY);
      const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

      const lineStyle = {
        position: 'absolute',
        left: `${fromX}px`,
        top: `${fromY}px`,
        width: `${length}px`,
        height: '2px',
        backgroundColor: '#d2b48c', // Same as table border color
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        pointerEvents: 'none',
        zIndex: 0,
      };

      renderedLines.push(<div key={line.id} style={lineStyle}></div>);
    });

    // Render the line being drawn
    if (isDrawingLine && startTableId) {
      const fromElement = elements.find((el) => el.id === startTableId);
      if (fromElement) {
        const fromX = fromElement.x + fromElement.width / 2;
        const fromY = fromElement.y + fromElement.height / 2;
        const toX = currentMousePosition.x;
        const toY = currentMousePosition.y;

        const length = Math.hypot(toX - fromX, toY - fromY);
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

        const lineStyle = {
          position: 'absolute',
          left: `${fromX}px`,
          top: `${fromY}px`,
          width: `${length}px`,
          height: '2px',
          backgroundColor: '#d2b48c',
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
          zIndex: 0,
        };

        renderedLines.push(<div key="drawing-line" style={lineStyle}></div>);
      }
    }

    return renderedLines;
  };

  return <>{renderLines()}</>;
};

export default LinesLayer;
