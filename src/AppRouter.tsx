import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AuthGuard } from './guards/AuthGuard';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AgendaScreen } from './pages/Agenda';
import { AlertsScreen } from './pages/Alerts';
import { DetailsScreen } from './pages/Details';
import { ExploreScreen } from './pages/Explore';
import { InfoScreen } from './pages/Info';
import { LoginScreen } from './pages/Login';
import { MapScreen } from './pages/Map';
import { SignupScreen } from './pages/Signup';
import { SplashScreen } from './pages/Splash';

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rota pública sem layout */}
        <Route path="/" element={<SplashScreen />} />

        {/* Rotas públicas com AuthLayout */}
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
          </Route>
        </Route>

        {/* Rotas protegidas com AppLayout */}
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<AppLayout />}>
            <Route path="/explore" element={<ExploreScreen />} />
            <Route path="/agenda" element={<AgendaScreen />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/alerts" element={<AlertsScreen />} />
            <Route path="/info" element={<InfoScreen />} />
          <Route path="/details/:type/:id" element={<DetailsScreen />} />

          </Route>
        </Route>

        {/* Rota de detalhes (sem layout para tela cheia) */}
        <Route element={<AuthGuard isPrivate />}>
        </Route>
      </Routes>
    </Router>
  );
}
