import { createPortal } from "react-dom";

export const Portal = ({
  children, containerNode = document.body 
}) => {
  if (typeof containerNode !== "object" || !containerNode?.nodeType) {
    console.error("Invalid containerNode passed to Portal component. Check Portal.");
    return null;
  }

  return createPortal(children, containerNode);
};
