/**
 * Left nav expanded state – shared so Header, LeftNav, and layout spacing stay in sync.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const LeftNavContext = createContext(null);

export function LeftNavProvider({ children }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded((e) => !e), []);

  const value = {
    expanded,
    setExpanded,
    toggleExpanded,
  };

  return (
    <LeftNavContext.Provider value={value}>
      {children}
    </LeftNavContext.Provider>
  );
}

export function useLeftNav() {
  const ctx = useContext(LeftNavContext);
  if (!ctx) {
    throw new Error('useLeftNav must be used within LeftNavProvider');
  }
  return ctx;
}

export default LeftNavContext;
