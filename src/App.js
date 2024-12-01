// App.js
import React from 'react';
import MainApp from './Components/MainApp';
import Login from './Pages/Login';
import WelcomeAnimation from './Components/Animations/index.js';
import './Styles/all-styles.js';

window.baseDomain = "https://squid-app-aychi.ondigitalocean.app/";
window.baseDomain = "http://localhost:5000/";

window.viewMode = 'full-screen';
window.isProduction = false;

const App = () => {
  const loginDone = localStorage.getItem('loginSuccessful') === 'true';
  const animationShown = localStorage.getItem('welcomeScreenShown') === 'true';
  const shouldShowAnimation = !animationShown && !window.isIframe;

  console.log('Current document cookies:', document.cookie);

  if (!loginDone) {
    return <Login />;
  } 
  else if (shouldShowAnimation)
  {
    return <WelcomeAnimation />;
  }
  else 
  {
    return <MainApp />;
  }
};

export default App;
