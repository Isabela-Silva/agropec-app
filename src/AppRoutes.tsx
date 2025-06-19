// src/App.tsx ou src/navigation/index.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SplashScreen from './pages/Splash'; // Assumindo que você tenha uma pasta 'screens' para as telas principais
import ExploreScreen from './pages/Explore';
import AgendaScreen from './pages/Agenda'; // Conforme sua estrutura anterior
import MapScreen from './pages/Map';
import AlertsScreen from './pages/Alerts';
import InfoScreen from './pages/Info';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/agenda" element={<AgendaScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/alerts" element={<AlertsScreen />} />
        <Route path="/info" element={<InfoScreen />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;