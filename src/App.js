// App.js
import React from 'react';
import MainApp from './Components/MainApp';
import Login from './Pages/Login';
import WelcomeAnimation from './Components/Animations/index.js';
import './Styles/all-styles.js';

window.baseDomain = 'http://localhost:5000/';
window.viewMode = 'full-screen';

const App = () => {
  const loginDone = localStorage.getItem('loginSuccessful') === 'true';
  const animationShown = localStorage.getItem('welcomeScreenShown') === 'true';

  if (!loginDone) {
    return <Login />;
  } 
  else if (!animationShown)
  {
    return <WelcomeAnimation />;
  }
  else 
  {
    return <MainApp />;
  }
};

export default App;
