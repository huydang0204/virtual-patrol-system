import React from "react";

import { List } from "reactstrap";
import { RxDotFilled } from "react-icons/rx";

function ValidationErrors({
  title = "",
  errors
}: {
  title?: string;
  errors: string[];
}) : JSX.Element {
  return (
    <div style={{ width : "100%" }}>
      <h6 className="mb-2 text-center text-black">{title}</h6>
      <List className="bg-gray-300 p-2 rounded rounded-3 text-black">
        {errors.map((label : string, index : number) => (
          <li key={index} className="mb-1">
            <RxDotFilled />
            {label}
          </li>
        ))}
      </List>
    </div>
  );
}

export default ValidationErrors;
