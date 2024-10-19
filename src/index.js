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
import { SearchProvider } from './Context/SearchContext.js';
import i18n from './i18n';
import './i18n';

import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/buttons.css';
import './Styles/z-index.css';
import './Styles/index.css';
import './Styles/mobile.css';
import SecondaryTopBar from './Components/Structural/SecondaryTopBar/index.js';

function App() {
  const loginSuccessful = localStorage.getItem('loginSuccessful') === 'true';
  window.baseDomain = "http://localhost:5000/";
  window.viewMode = "full-screen";
  window.restaurantId = "restaurantId123";
  
  return loginSuccessful ? (
    <div className="app-component">
      <SearchProvider>
      <TopBar />
      <SecondaryTopBar />
      <Sidebar />
      <ContentRouting />
      </SearchProvider>
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
