import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Weather from './components/Weather';
// import FirstTime from './components/FirstTime';
import React, { useState, useEffect } from 'react';

const WEATHER_APP_STORAGE = 'weatherApp.Storage';

function App() {

  const [showFirstTime, setShowFirstTime] = useState(false);

  useEffect(() => {
    setShowFirstTime(JSON.parse(localStorage.getItem(WEATHER_APP_STORAGE + ".showFirstTime") || true));
  }, [])

  useEffect(() => {
      localStorage.setItem(WEATHER_APP_STORAGE + ".showFirstTime", showFirstTime);
  }, [showFirstTime])

  return (
    <>
      
      {showFirstTime === false && <Header />}
      {showFirstTime === false && <Weather />}
      {/* {showFirstTime === true && <FirstTime onClick={(v) => setShowFirstTime(false)} />} */}
    </>
  );


}

export default App;
