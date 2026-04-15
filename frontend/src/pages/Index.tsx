import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import Dashboard from './Dashboard';

export function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
}

export default Index;
