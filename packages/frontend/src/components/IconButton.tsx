import React from "react";

import { Button } from "reactstrap";

type ComponentProps = {
  isIconReversed ?: boolean;
  Icon: JSX.Element;
  label: string;
  color: string;
  className: string;
  styles?: { backgroundColor ?: string, border ?: string, width ?: string };
  selectedValueShown ?: {
    value : JSX.Element | string;
  };
  onClick?: () => void;
};

const IconButton = (props: ComponentProps): JSX.Element => {
  const {
    isIconReversed = false, Icon, label, color, className, styles, selectedValueShown, onClick 
  } = props;

  return (
    <Button color={color} className={className} style={styles} onClick={onClick}>
      <div className={`d-flex align-items-center justify-content-between gap-2 ${isIconReversed ? "flex-row-reverse" : ""}`}>
        {!!selectedValueShown ? selectedValueShown.value : <>{Icon} <span data-test="icon-button__label">{label}</span></>}
      </div>
    </Button>
  );
};

export default IconButton;
