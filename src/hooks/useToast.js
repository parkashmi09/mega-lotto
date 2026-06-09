/**
 * Toast notifications using react-hot-toast and theme CSS variables.
 */

import toast from 'react-hot-toast';

const getVar = (v) =>
  typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(v).trim()
    : '';

export function useToast() {
  const showSuccess = (message, options = {}) => {
    const color = getVar('--color-success') || '#16A34A';
    return toast.success(message, {
      duration: 2000,
      position: 'top-center',
      style: {
        background: color,
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    const color = getVar('--color-danger') || getVar('--color-red-2') || '#DC2626';
    return toast.error(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: color,
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    const bg = getVar('--color-background-secondary') || '#161C33';
    const fg = getVar('--color-foreground-secondary') || '#9CA3AF';
    return toast(message, {
      duration: 2000,
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: bg,
        color: fg,
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  };

  return { showSuccess, showError, showInfo };
}

export default useToast;
