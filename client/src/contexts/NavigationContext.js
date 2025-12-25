import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexto para gerenciar navegação e estado do menu
const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activePath, setActivePath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setActivePath(window.location.pathname);
    };

    // Escutar mudanças na URL
    window.addEventListener('popstate', handleLocationChange);

    // Também verificar mudanças programáticas
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      originalPushState.apply(this, arguments);
      handleLocationChange();
    };

    window.history.replaceState = function(state, title, url) {
      originalReplaceState.apply(this, arguments);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setActivePath(path);
    // Disparar evento de navegação
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const isActive = (path) => {
    return activePath === path
      ? "bg-blue-800 border-r-4 border-yellow-400"
      : "hover:bg-blue-800";
  };

  return (
    <NavigationContext.Provider value={{ activePath, navigateTo, isActive }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};