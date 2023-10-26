import React, { MouseEvent } from "react";
import { VscClose } from "react-icons/vsc";

import { BadgeProps } from "model-type/component-style";

function Badge({
  text, variant = "primary", type = "rounded", noWrap = false, onRemove 
}: BadgeProps) : JSX.Element {
  return (
    <div className={`d-inline-flex m-1 p-1 px-2 ${type === "rounded" ? "rounded-3" : "rounded-4"} ${variant}`}>
      <div
        style={{
          position : "relative",
          paddingRight : `${!!onRemove ? "15px" : "0"}`,
          whiteSpace : `${noWrap ? "nowrap" : "normal"}`
        }}>
        <span className="badge-label">{text}</span>{" "}
        {!!onRemove && (
          <VscClose
            style={{
              position : "absolute",
              right : 0,
              top : "50%",
              transform : "translateY(-50%)"
            }}
            className="btn-badge-close"
            onClick={(e : MouseEvent) : void => onRemove(e)}
          />
        )}
      </div>
    </div>
  );
}

export default Badge;
