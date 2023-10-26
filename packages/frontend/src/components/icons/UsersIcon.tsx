import React from "react";

import IconContainer from "./IconContainer";
import { IconProps } from "model-type/component-style";

function UserIcon(props: IconProps): JSX.Element {
  const {
    color, className 
  } = props;

  return (
    <IconContainer viewBox="0 0 36 36" className={className}>
      <path stroke={color} strokeWidth={0.7} d="M13.1051 19.0464C18.2566 19.0464 22.4406 14.8623 22.4406 9.71068C22.4406 4.55908 18.2566 0.375 13.1051 0.375C7.95356 0.375 3.76953 4.55908 3.76953 9.71068C3.76953 14.8623 7.95356 19.0464 13.1051 19.0464ZM13.1051 2.0724C17.3146 2.0724 20.7433 5.50114 20.7433 9.71068C20.7433 13.9202 17.3146 17.349 13.1051 17.349C8.8956 17.349 5.4669 13.9202 5.4669 9.71068C5.4669 5.50114 8.8956 2.0724 13.1051 2.0724Z" fill="white"/>
      <path stroke={color} strokeWidth={0.7} d="M25.3029 3.10807C24.9719 3.43906 24.9719 3.97374 25.3029 4.30474C28.2733 7.28367 28.2733 12.1297 25.3029 15.1086C24.9719 15.4396 24.9719 15.9743 25.3029 16.3053C25.6339 16.6363 26.1686 16.6363 26.5081 16.3053C30.1405 12.6729 30.1405 6.74898 26.5081 3.10807C26.3384 2.94682 26.1261 2.86194 25.9055 2.86194C25.6848 2.86194 25.4642 2.94682 25.3029 3.10807Z" fill="white"/>
      <path stroke={color} strokeWidth={0.7} d="M30.1716 28.1273C30.7996 29.3664 30.927 30.8007 30.927 31.7767C30.927 32.2435 31.3089 32.6254 31.7756 32.6254C32.2424 32.6254 32.6243 32.2435 32.6243 31.7767C32.6243 30.6225 32.4631 28.9251 31.6823 27.3635C31.1052 26.2092 29.951 24.7155 27.7359 24.1639C27.668 24.1469 27.5916 24.1384 27.5237 24.1384C27.1418 24.1384 26.8024 24.393 26.7005 24.7834C26.6411 25.0041 26.675 25.2332 26.7939 25.4284C26.9127 25.6236 27.0909 25.7594 27.3115 25.8104C28.6015 26.1329 29.5606 26.9052 30.1716 28.1273Z" fill="white"/>
      <path stroke={color} strokeWidth={0.7} d="M7.16449 25.8358H19.0461C21.4988 25.8358 24.1382 28.1103 24.1382 31.7767C24.1382 32.2435 24.5201 32.6254 24.9869 32.6254C25.4537 32.6254 25.8356 32.2435 25.8356 31.7767C25.8356 27.5672 22.7888 24.1384 19.0461 24.1384H7.16449C3.42179 24.1384 0.375 27.5672 0.375 31.7767C0.375 32.2435 0.756909 32.6254 1.22369 32.6254C1.69046 32.6254 2.07237 32.2435 2.07237 31.7767C2.07237 28.1103 4.71179 25.8358 7.16449 25.8358Z" fill="white"/>
    </IconContainer>
  );
}

export default UserIcon;