import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Components/Structural/Sidebar/index.js';
import ContentRouting from './Components/Structural/ContentRouting/index.js';
import AccountManagement from './Pages/Account/index.js';
import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/index.css';

function App() {
  const loginSuccessful = localStorage.getItem('loginSuccessful') === 'true';
  
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
