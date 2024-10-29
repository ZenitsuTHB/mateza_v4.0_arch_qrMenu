// App.js
import React from 'react';
import Sidebar from './Components/Structural/Sidebar';
import ContentRouting from './Components/Structural/ContentRouting';
import TopBar from './Components/Structural/TopBar';
import SecondaryTopBar from './Components/Structural/SecondaryTopBar';
import Login from './Pages/Login';
import WelcomeAnimation from './Pages/WelcomeAnimation';
import './Styles/all-styles.js'

window.baseDomain = 'http://localhost:5000/';
window.viewMode = 'full-screen';

const App = () => {
  const isLoginSuccessful = localStorage.getItem('loginSuccessful') === 'true';
  const isWelcomeScreenShown = localStorage.getItem('welcomeScreen') === 'true';

  if (isLoginSuccessful) {
    if (isWelcomeScreenShown) {
      return (<div className="app-component">
        <TopBar />
        <SecondaryTopBar />
        <Sidebar />
        <ContentRouting />
      </div>);
    }
    return <WelcomeAnimation />;
  }

  return <Login />;
};

export default App;
