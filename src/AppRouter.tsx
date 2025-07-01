import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { InstallPWA } from './components/InstallPWA';
import { AuthGuard } from './guards/AuthGuard';
import { AdminLayout } from './layouts/AdminLayout';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AgendaScreen } from './pages/Agenda';
import { DetailsScreen } from './pages/Details';
import { ExploreScreen } from './pages/Explore';
import { InfoScreen } from './pages/Info';
import { LoginScreen } from './pages/Login';
import Map from './pages/Map';
import { NotificationsScreen } from './pages/Notifications';
import { SignupScreen } from './pages/Signup';
import { SplashScreen } from './pages/Splash';

// Admin imports
import { LoginForm } from './pages/Admin/components/Auth/LoginForm';
import { Dashboard } from './pages/Admin/components/Dashboard/Dashboard';
import { ActivitiesPage } from './pages/Admin/pages/ActivitiesPage';
import { AdminsPage } from './pages/Admin/pages/AdminsPage';
import { CategoriesPage } from './pages/Admin/pages/CategoriesPage';
import { CompaniesPage } from './pages/Admin/pages/CompaniesPage';
import { HighlightsPage } from './pages/Admin/pages/HighlightsPage';
import { NotificationsPage } from './pages/Admin/pages/NotificationsPage';
import { StandsPage } from './pages/Admin/pages/StandsPage';
import { UsersPage } from './pages/Admin/pages/UsersPage';

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<SplashScreen />} />

        {/* Rotas públicas com AuthLayout */}
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
          </Route>
        </Route>

        {/* Rotas protegidas do app mobile com AppLayout */}
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<AppLayout />}>
            <Route path="/explore" element={<ExploreScreen />} />
            <Route path="/agenda" element={<AgendaScreen />} />
            <Route path="/map" element={<Map />} />
            <Route path="/notificacoes" element={<NotificationsScreen />} />
            <Route path="/info" element={<InfoScreen />} />
            <Route path="/detalhes/:type/:id" element={<DetailsScreen />} />
          </Route>
        </Route>

        {/* Rotas do admin - removido AdminAuthProvider */}
        {/* Rota de login do admin (pública) */}
        <Route path="/admin/login" element={<LoginForm />} />

        {/* Rotas protegidas do admin com AdminLayout */}
        <Route element={<AuthGuard isPrivate tokenKey="admin_token" redirectTo="/admin/login" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/admins" element={<AdminsPage />} />
            <Route path="/admin/companies" element={<CompaniesPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/activities" element={<ActivitiesPage />} />
            <Route path="/admin/stands" element={<StandsPage />} />
            <Route path="/admin/highlights" element={<HighlightsPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<SplashScreen />} />
      </Routes>

      {/* InstallPWA fora das rotas, mas dentro do Router */}
      <InstallPWA />
    </Router>
  );
}
