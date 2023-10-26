import React, {
  createContext, useContext, useState 
} from "react";

type MenuContextValue = {
  showMenu: boolean;
  forceOpen: boolean;
  toggleMenu: (e : any, forceHide ?: boolean, forceOpen ?: boolean) => void;
  setForceOpen;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("❌ Hey! useMenuContext must be used within a MenuProvider");
  return context;
}

export function MenuProvider({ children }) {
  const [showMenu,
    setShowMenu] = useState(true);
  const [forceOpen,
    setForceOpen] = useState(false);

  const toggleMenu = (e, forceHide ?: boolean, foceOpen ?: boolean) => {
    if (foceOpen) {
      setShowMenu(true);
      setForceOpen(true);
    } else if (forceHide) {
      setShowMenu(false);
      setForceOpen(false);
    } else {
      setShowMenu((prevShowMenu) => !prevShowMenu);
    }
  };

  const contextValue: MenuContextValue = {
    showMenu,
    toggleMenu,
    forceOpen,
    setForceOpen
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}
