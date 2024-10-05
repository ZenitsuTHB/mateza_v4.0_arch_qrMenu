// App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar/index.js';
import Content from './Content/index.js';
import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/index.css';

function App() {
  return (
    <div className="app-component">
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
