// App.js
import React from 'react';
import Sidebar from './Components/Structural/Sidebar/index.js';
import ContentRouting from './Components/Structural/ContentRouting/index.js';
import TopBar from './Components/Structural/TopBar/index.js';
import SecondaryTopBar from './Components/Structural/SecondaryTopBar/index.js';
import Login from './Pages/Login/index.js';
import './Styles/fonts.css';
import './Styles/colors.css';
import './Styles/buttons.css';
import './Styles/containers.css';
import './Styles/z-index.css';
import './Styles/index.css';
import './Styles/mobile.css';

function App() {
  const loginSuccessful = localStorage.getItem('loginSuccessful') === 'true';
  window.baseDomain = "http://localhost:5000/";
  window.viewMode = "full-screen";
  
  return loginSuccessful ? (
    <div className="app-component">
      <TopBar />
      <SecondaryTopBar />
      <Sidebar />
      <ContentRouting />
    </div>
  ) : (
    <div>
      <Login />
    </div>
  );
}

export default App;
