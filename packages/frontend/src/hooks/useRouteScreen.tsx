import { useLocation } from "react-router-dom";

import { RouteScreen } from "model-type/component-style";
import { ROUTE_PATH_INFO } from "data/route-path";

function useRouteScreen() : RouteScreen {
  const location = useLocation();

  const pathname = location.pathname;
  let key = pathname;

  let mainMenuKey = "",
    subMenuKey = "";
  if (pathname) {
    const parts = pathname.split("/");
    const partLen = parts.length;
    if (partLen >= 3) {
      key = parts.join("/");
      mainMenuKey = parts.slice(0, 3).join("/");
      subMenuKey = key;
    }
  }

  const route = ROUTE_PATH_INFO[key];

  return {
    route,
    mainMenuKey,
    subMenuKey
  };
}

export default useRouteScreen;
