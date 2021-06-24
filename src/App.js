import './App.css';
import Header from './components/Header';
import Weather from './components/Weather';
import Footer from './components/Footer';
// import FirstTime from './components/FirstTime';
import React, { useState, useEffect } from 'react';

const WEATHER_STORAGE_KEY = 'weatherApp.Storage';

function App() {

  const [showFirstTime, setShowFirstTime] = useState(false);

  useEffect(() => {
    setShowFirstTime(JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY + ".showFirstTime") || false));
  }, [])

  useEffect(() => {
      localStorage.setItem(WEATHER_STORAGE_KEY + ".showFirstTime", showFirstTime);
  }, [showFirstTime])

  return (
    <>
      
      {showFirstTime === false && <Header />}
      {showFirstTime === false && <Weather />}
      {!showFirstTime && <Footer />}
      {/* {showFirstTime === true && <FirstTime onClick={(v) => setShowFirstTime(false)} />} */}
    </>
  );


}

export default App;
