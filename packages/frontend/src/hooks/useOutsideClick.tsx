import React, {
  useEffect, useRef, useState 
} from "react";

const useOutsideClick = (initialOpenState, additionalHandler?) => {
  const ref = useRef(null);
  const [isOpen,
    setIsOpen] = useState(initialOpenState);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        if (additionalHandler) additionalHandler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return [ref,
    isOpen,
    setIsOpen];
};
export default useOutsideClick;
