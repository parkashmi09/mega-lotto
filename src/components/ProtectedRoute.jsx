import { Navigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState.js';

/**
 * Gate a route behind the static-auth session. Not logged in → redirect to
 * /login (which overlays the AuthModal). Used to stop ticket purchase without login.
 */
export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthState();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
