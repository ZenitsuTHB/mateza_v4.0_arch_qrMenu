import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Components/Structural/Sidebar/index.js';
import ContentRouting from './Components/Structural/ContentRouting/index.js';
import TopBar from './Components/Structural/TopBar/index.js';
import AccountManagement from './Pages/Account/index.js';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './i18n';

import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/index.css';
import './Styles/mobile.css';

function App() {
  const loginSuccessful = localStorage.getItem('loginSuccessful') === 'true';
  
  return loginSuccessful ? (
    <div className="app-component">
      <TopBar />
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
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </I18nextProvider>
);
