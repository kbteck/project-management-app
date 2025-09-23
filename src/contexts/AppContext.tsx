import React, { createContext, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AppContextType {
  // Add global app state here as needed
}

const defaultAppContext: AppContextType = {
  // Default values here
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};
