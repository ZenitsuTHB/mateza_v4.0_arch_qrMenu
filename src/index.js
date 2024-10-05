import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Components/Structural/Sidebar/index.js';
import ContentRouting from './Components/Structural/ContentRouting/index.js';
import AccountManagement from './Pages/Account/index.js'; // Assuming Account component is in Pages/Account
import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/index.css';

function App() {
  window.loginSuccessful = false;
  const loginSuccessful = window.loginSuccessful || false; // Default to false if not defined

  
  return loginSuccessful ? (
    <div className="app-component">
      <Sidebar />
      <ContentRouting />
    </div>
  ) : (
    <div>
      <AccountManagement />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
