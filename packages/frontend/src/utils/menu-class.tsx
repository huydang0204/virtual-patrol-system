import useLeftMenuState from "hooks/useLeftMenuState";
import useWindowDimensions from "hooks/useWindowDimensions";

import { LEFT_MENU_STATE } from "data/common-data";
import { LeftMenuState } from "../model-type/component-style";

function getMenuClass(showMenu: boolean = undefined, forceHide = false, forceOpen = false) {
  const { width } = useWindowDimensions();
  const { menuState }: LeftMenuState = useLeftMenuState();
  const SMALL_SCREEN_WIDTH = 768;
  let menuClass = "";

  if (forceOpen) {
    return "show-menu";
  } else if (width < SMALL_SCREEN_WIDTH && !forceOpen) {
    return "hide-menu";
  }
  if (!!showMenu || forceOpen) return "show-menu";
  else if (!!showMenu && !showMenu) return "hide-menu";
  else if (showMenu === undefined || showMenu === null) {
    switch (menuState) {
      case LEFT_MENU_STATE.NONE:
        menuClass = "hide-menu";
        break;
      case LEFT_MENU_STATE.MAX:
        menuClass = "hide-menu";
        break;
      case LEFT_MENU_STATE.MAIN:
        menuClass = "show-menu";
        break;
      case LEFT_MENU_STATE.SUB:
        menuClass = "show-sub-menu";
        break;
    }
    if (width < SMALL_SCREEN_WIDTH) {
      menuClass = "hide-menu";
    }
    return menuClass;
  }

}

export default getMenuClass;
