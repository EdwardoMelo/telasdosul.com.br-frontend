import React, { createContext, useContext, useState } from "react";

interface NavContextType {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  
  return (
    <NavContext.Provider value={{ navbarHeight, setNavbarHeight }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};
