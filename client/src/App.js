import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Disease Recommendation Components
import EarlyStemRecommendation from './components/EarlyStemRecommendation';
import ModerateStemRecommendation from './components/ModerateStemRecommendation';
import CriticalStemRecommendation from './components/CriticalStemRecommendation';

import EarlyFruitRotRecommendation from './components/EarlyFruitRotRecommendation';
import ModerateFruitRotRecommendation from './components/ModerateFruitRotRecommendation';
import CriticalFruitRotRecommendation from './components/CriticalFruitRotRecommendation';

import EarlyYellowLeafRecommendation from './components/EarlyYellowLeafRecommendation';
import ModerateYellowLeafRecommendation from './components/ModerateYellowLeafRecommendation';
import CriticalYellowLeafRecommendation from './components/CriticalYellowLeafRecommendation';

// Other Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import About from './components/About';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Signup from './components/Signup';
import ScanPage from './components/ScanPage';

function Layout({ children }) {
  const location = useLocation();

  // Paths where navbar should be hidden
  const hideNavbarPaths = [
    '/scan',
    '/early-stem-bleeding',
    '/moderate-stem-bleeding',
    '/critical-stem-bleeding',
    '/early-fruit-rot',
    '/moderate-fruit-rot',
    '/critical-fruit-rot',
    '/early-yellow-leaf',
    '/moderate-yellow-leaf',
    '/critical-yellow-leaf'
  ];

  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* General Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/scan" element={<ScanPage />} />
          
          {/* Stem Bleeding Recommendations */}
          <Route path="/early-stem-bleeding" element={<EarlyStemRecommendation />} />
          <Route path="/moderate-stem-bleeding" element={<ModerateStemRecommendation />} />
          <Route path="/critical-stem-bleeding" element={<CriticalStemRecommendation />} />

          {/* Fruit Rot Recommendations */}
          <Route path="/early-fruit-rot" element={<EarlyFruitRotRecommendation />} />
          <Route path="/moderate-fruit-rot" element={<ModerateFruitRotRecommendation />} />
          <Route path="/critical-fruit-rot" element={<CriticalFruitRotRecommendation />} />

          {/* Yellow Leaf Recommendations */}
          <Route path="/early-yellow-leaf" element={<EarlyYellowLeafRecommendation />} />
          <Route path="/moderate-yellow-leaf" element={<ModerateYellowLeafRecommendation />} />
          <Route path="/critical-yellow-leaf" element={<CriticalYellowLeafRecommendation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
