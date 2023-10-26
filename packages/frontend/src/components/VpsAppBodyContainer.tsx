import React, { memo } from "react";

import getMenuClass from "utils/menu-class";

import { useMenuContext } from "contexts/MenuContext";

function VpsAppBodyContainer(props : {
  children : JSX.Element | JSX.Element[],
  id : string
}) : JSX.Element {
  const {
    children,
    id
  } = props;

  const {
    showMenu, forceOpen 
  } = useMenuContext();
  const menuClass = getMenuClass(showMenu, false, forceOpen);

  return (
    <div
      className={ "vps-content " + menuClass }
      id={ id }>
      {
        children
      }
    </div>
  );
}

export default memo(VpsAppBodyContainer);
