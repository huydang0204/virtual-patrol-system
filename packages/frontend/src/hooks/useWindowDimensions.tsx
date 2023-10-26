import { useMenuContext } from "contexts/MenuContext";
import {
  useEffect, useState 
} from "react";

function getWindowDimensions() {
  const {
    innerWidth : width, innerHeight : height
  } = window;
  return {
    width,
    height
  };
}


export default function useWindowDimensions() {
  const { setForceOpen } = useMenuContext();

  const [windowDimensions,
    setWindowDimensions] = useState<{
        width: number;
        height: number;
    }>(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setForceOpen(false);
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
