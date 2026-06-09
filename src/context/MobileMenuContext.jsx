/**
 * Controls the mobile MENU drawer (opened from the bottom-nav MENU tab).
 * Kept separate from LeftNavContext so the full-screen mobile menu and the
 * desktop left-nav expand/collapse state never interfere.
 */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MobileMenuContext = createContext(null);

export function MobileMenuProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo(
    () => ({ open, openMenu, closeMenu, toggleMenu }),
    [open, openMenu, closeMenu, toggleMenu]
  );

  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) throw new Error('useMobileMenu must be used within MobileMenuProvider');
  return ctx;
}

export default MobileMenuContext;
