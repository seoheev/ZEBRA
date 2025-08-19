import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Topbar from './components/ALL/Topbar/topbar.jsx'
import Navbar from './components/ALL/Navbar/navbar.jsx';
import MainPage from './components/HOME/mainPage';
import SignUpPage from './components/SIGNUP/SignUpPage';
import RegisterPage from './components/REGISTER/Building/buildingRegister';
import NoticePage from './components/NOTICE/Notice/notice.jsx';
import IntroPage from './components/INTRO/Introdution/intro.jsx';
import EmissionPage from './components/EMISSIONS/emissions.jsx';

function App() {
  return (
    <Router>
      <Topbar />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/emissions" element={<EmissionPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Routes>
    </Router>
  );
}

export default App;