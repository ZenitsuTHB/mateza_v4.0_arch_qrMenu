// App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Components/Sidebar/index.js';
import ContentRouting from './Components/ContentRouting/index.js';
import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/index.css';

function App() {
  return (
    <div className="app-component">
      <Sidebar />
      <ContentRouting />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
