import React from "react";

import IconContainer from "./IconContainer";
import { IconProps } from "model-type/component-style";

function AlertTypeIcon(props: IconProps): JSX.Element {
  const {
    color, className 
  } = props;

  return (
    <IconContainer viewBox="0 0 34 34" className={className}>
      <path fill="none" d="M4.15297 20.1629C4.15297 14.0667 9.09498 9.12465 15.1913 9.12465C21.2875 9.12465 26.2295 14.0667 26.2295 20.1629V27.8249C26.2295 28.7607 25.4709 29.5193 24.5351 29.5193H5.84738C4.91158 29.5193 4.15297 28.7607 4.15297 27.8249V20.1629Z" color={color}
        stroke={color} strokeWidth={2.3}/>
      <path fill="none" d="M4.72656 33.8984L25.6568 33.8984" color={color}
        stroke={color} strokeWidth={2.3} strokeLinecap="round"/>
      <path fill="none" d="M15.1875 5.35303V1.10156" color={color}
        stroke={color} strokeWidth={2.3} strokeLinecap="round"/>
      <path fill="none" d="M4.03827 8.96669L0.800781 5.96045" color={color}
        stroke={color} strokeWidth={2.3} strokeLinecap="round"/>
      <path fill="none" d="M26.9617 8.96669L30.1992 5.96045" color={color}
        stroke={color} strokeWidth={2.3} strokeLinecap="round"/>
    </IconContainer>
  );
}

export default AlertTypeIcon;
