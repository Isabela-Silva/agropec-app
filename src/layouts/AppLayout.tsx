import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-base-white-light pb-28">
      <Outlet />
      <BottomNavBar />
    </div>
  );
}
