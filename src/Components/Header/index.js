import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const [isChildrenVisible, setIsChildrenVisible] = useState(true);

    const toggleChildrenVisibility = () => {
      setIsChildrenVisible((prev) => !prev);
    };

    return (
      <div>
        <header style={{ display: 'flex', alignItems: 'center' }}>
          <h1>{props.title}</h1>
          {props.children && (
            <button onClick={toggleChildrenVisibility} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
              {isChildrenVisible ? <FaAngleUp /> : <FaAngleDown />}
            </button>
          )}
        </header>
        {isChildrenVisible && <WrappedComponent {...props} />}
      </div>
    );
  };
};

export { withHeader };