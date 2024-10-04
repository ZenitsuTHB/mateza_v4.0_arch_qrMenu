// App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar/index.js';
import Content from './Routing/index.js';
import './Styles/fonts.css';
import './index.css';

function App() {
  return (
    <div className="app-component" style={{ display: 'flex' }}>
      <Sidebar />
      <Content />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
