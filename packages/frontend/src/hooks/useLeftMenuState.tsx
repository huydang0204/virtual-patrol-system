import {
  useEffect, useState 
} from "react";

import {
  EVENT_EMITTER_NAME,
  EventEmitter
} from "utils/event-emitter";
import {
  getScreenSize, MEDIUM_SCREEN_SIZE, SMALL_SCREEN_SIZE 
} from "utils/screen";
import { LEFT_MENU_STATE } from "data/common-data";
import { LeftMenuState } from "model-type/component-style";

let menuState = LEFT_MENU_STATE.MAIN;
let _windowSize = MEDIUM_SCREEN_SIZE;

const subscribe = onChange => {
  EventEmitter.subscribe(EVENT_EMITTER_NAME.EVENT_LEFT_MENU_STATE_CHANGE, onChange);
};

const unsubscribe = onChange => {
  EventEmitter.unsubscribe(EVENT_EMITTER_NAME.EVENT_LEFT_MENU_STATE_CHANGE, onChange);
};

const onStateChange = () => {
  EventEmitter.emit(EVENT_EMITTER_NAME.EVENT_LEFT_MENU_STATE_CHANGE, menuState);
};

const setMenuState = newState => {
  if (newState !== menuState) {
    menuState = newState;

    onStateChange();
  }
};

const nextMenuState = () => {
  let newMenuState = menuState + 1;
  if (newMenuState > LEFT_MENU_STATE.MAX) {
    newMenuState = 1;
  }
  if (_windowSize === MEDIUM_SCREEN_SIZE && newMenuState === LEFT_MENU_STATE.NONE) {
    newMenuState = LEFT_MENU_STATE.MAIN;
  }

  setMenuState(newMenuState);
};

const resetMenuState = () => {
  switch (_windowSize) {
    case MEDIUM_SCREEN_SIZE:
      setMenuState(LEFT_MENU_STATE.MAIN);
      break;
    case SMALL_SCREEN_SIZE:
      setMenuState(LEFT_MENU_STATE.NONE);
      break;
  }
};

const handleWindowResize = () => {
  const w = window,
    d = document,
    documentElement = d.documentElement,
    body = d.getElementsByTagName("body")[0];

  const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
  const size = getScreenSize(width);
  if (size !== _windowSize) {
    _windowSize = size;

    let newMenuState = null;
    switch (_windowSize) {
      case MEDIUM_SCREEN_SIZE:
        if (menuState < LEFT_MENU_STATE.MAIN) {
          newMenuState = LEFT_MENU_STATE.MAIN;
        }
        break;
      case SMALL_SCREEN_SIZE:
        newMenuState = LEFT_MENU_STATE.NONE;
    }

    newMenuState && setMenuState(newMenuState);
  }
};

const handlePageClick = event => {
  const topNav = document.getElementById("top-nav");
  const menuBtnElement = topNav ? topNav.getElementsByClassName("menu-button")[0] : null;
  const sideBarElement = document.getElementById("left-sidebar");
  const targetElement = event.target; // clicked element

  const inside =
        (
          sideBarElement &&
            (sideBarElement === targetElement || sideBarElement.contains(targetElement))
        ) ||
        (
          menuBtnElement &&
            (menuBtnElement == targetElement || menuBtnElement.contains(targetElement))
        );

  !inside && resetMenuState();
};

window.addEventListener("resize", handleWindowResize);
document.addEventListener("mousedown", handlePageClick);

handleWindowResize();

function useLeftMenuState(): LeftMenuState {
  const [
    mainState,
    setMainState
  ] = useState<LEFT_MENU_STATE>(menuState);

  useEffect(() => {
    const onChange = newState => {
      setMainState(newState);
    };
    subscribe(onChange);

    return function clean() {
      unsubscribe(onChange);
    };
  }, []);

  return {
    menuState : mainState,
    setMenuState,
    nextMenuState,
    resetMenuState
  };
}

export default useLeftMenuState;
