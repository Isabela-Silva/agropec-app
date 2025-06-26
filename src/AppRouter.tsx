import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AgendaScreen from './pages/Agenda';
import AlertsScreen from './pages/Alerts';
import { ExploreScreen } from './pages/Explore';
import InfoScreen from './pages/Info';
import { LoginScreen } from './pages/Login';
import MapScreen from './pages/Map';
import { SignupScreen } from './pages/Signup';
import { SplashScreen } from './pages/Splash';

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/agenda" element={<AgendaScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/alerts" element={<AlertsScreen />} />
        <Route path="/info" element={<InfoScreen />} />
      </Routes>
    </Router>
  );
}
