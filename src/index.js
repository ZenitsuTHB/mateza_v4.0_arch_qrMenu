import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Components/Structural/Sidebar/index.js';
import ContentRouting from './Components/Structural/ContentRouting/index.js';
import AccountManagement from './Pages/Account/index.js';
import { Provider } from 'react-redux';
import store from './Redux/store.js'; // Path to your store

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
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
