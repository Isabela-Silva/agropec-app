import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';
import { SafeNotificationProvider } from '../components/SafeNotificationProvider';

export function AppLayout() {
  return (
    <SafeNotificationProvider>
      <div className="min-h-screen bg-base-white-light pb-28">
        <Outlet />
        <BottomNavBar />
      </div>
    </SafeNotificationProvider>
  );
}
