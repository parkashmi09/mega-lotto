import { Button } from './Button.jsx';

/**
 * Auth button (Login = secondary, Signup = primary). Uses Button component with navigation.
 */
export function AuthLink({ to, variant = 'secondary', children }) {
  return <Button to={to} variant={variant}>{children}</Button>;
}

export default AuthLink;
