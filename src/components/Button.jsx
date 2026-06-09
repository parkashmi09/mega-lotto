import { Link } from 'react-router-dom';

const baseClasses =
  'rounded-full px-4 py-1.5 text-xs sm:text-sm font-[740] uppercase transition-colors';

const variants = {
  primary:
    'bg-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)] hover:opacity-90 transition-opacity',
  secondary:
    'border border-[var(--color-border)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-surface-2)]',
};

/**
 * Button component. Use `to` for navigation (renders as Link), omit for a plain button.
 * @param {{ to?: string, variant?: 'primary' | 'secondary', type?: string, children: React.ReactNode, className?: string, disabled?: boolean }} props
 */
export function Button({ to, variant = 'secondary', type = 'button', children, className = '', disabled }) {
  const variantClasses = variants[variant] || variants.secondary;
  const combinedClassName = [baseClasses, variantClasses, disabled && 'opacity-50 cursor-not-allowed', className].filter(Boolean).join(' ');

  if (to != null && to !== '') {
    return <Link to={to} className={combinedClassName}>{children}</Link>;
  }

  return (
    <button type={type} className={combinedClassName} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
