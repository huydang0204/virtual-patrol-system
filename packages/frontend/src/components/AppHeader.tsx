import React, { memo } from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "reactstrap";

import SettingsIcon from "./icons/SettingsIcon";
import NotifyBellIcon from "./icons/NotifyBellIcon";
import useUserAccount from "hooks/useUserAccount";

import {
  SETTINGS_PATH,
  USER_LOGOUT_PATH,
  USER_PROFILE_PATH
} from "data/route-path";
import { USER_ROLE } from "@vps/utils/lib/data";
import { useMenuContext } from "contexts/MenuContext";

function UserInfo(props : {
  id : string,
  name : string,
  role : string,
  avatar : string,
  history
}) : JSX.Element {
  const {
    id,
    name,
    role,
    avatar,
    history
  } = props;

  const redirectToUserProfile = () : void => {
    history && history.push({
      pathname : USER_PROFILE_PATH.replace(":id", id),
      state : { isOwner : true }
    });
  };

  return <div className="user">
    <div className="d-inline-block align-middle">
      <div className="avatar rounded-circle d-flex align-items-center justify-content-center me-1">
        {
          !avatar ?
            <i className="simple-icon-user text-gray-500 default-img" /> :
            <div
              className="img"
              style={ { "backgroundImage" : `url(${ avatar })` } } />
        }
        <div
          className="show-profile"
          onClick={ redirectToUserProfile }>
          <i className="simple-icon-settings" />
        </div>
      </div>
    </div>
    <div className="d-none d-md-inline-flex flex-column name align-middle text-truncate">
      <div data-test="app-header__username" className="text-white">{ name ? name : "User" }</div>
      <div data-test="app-header__user-role" className="text-purple">{ role ? role : "—" }</div>
    </div>
  </div>;
}

interface ComponentProps {
  newNotificationCount : number,
  toggleNotificationSidebar : () => void
}

const AppHeader : React.FC<ComponentProps> = ({
  newNotificationCount,
  toggleNotificationSidebar
} : ComponentProps) => {
  const history = useHistory();
  const { toggleMenu } = useMenuContext();

  const {
    accountId,
    name : accountName,
    role : accountRole,
    avatar : accountAvatar
  } = useUserAccount();

  const redirectToPage = (page : string) : void => {
    history && history.push(page);
  };

  return <Navbar
    data-test="app-header"
    id="top-nav"
    fixed="top">
    <div>
      <div className="d-flex justify-content-start align-items-center">
        <div
          className="menu-button nHideSub"
          onClick={ (e) => toggleMenu(e, false, true) }>
          <svg
            className="main nHideSub"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 17"
            color="white">
            <rect
              x="0.48"
              y="0.5"
              width="7"
              height="1" />
            <rect
              x="0.48"
              y="7.5"
              width="7"
              height="1" />
            <rect
              x="0.48"
              y="15.5"
              width="7"
              height="1" />
          </svg>
          <svg
            className="sub nHideSub"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 17">
            <rect
              x="1.56"
              y="0.5"
              width="16"
              height="1" />
            <rect
              x="1.56"
              y="7.5"
              width="16"
              height="1" />
            <rect
              x="1.56"
              y="15.5"
              width="16"
              height="1" />
          </svg>
        </div>
      </div>
    </div>

    <div className="d-flex justify-content-end align-items-center">
      {
        accountRole === USER_ROLE.Admin &&
        <div
          data-test="app-header__settings-icon"
          className="me-2 cursor-pointer"
          onClick={ () : void => redirectToPage(SETTINGS_PATH) }>
          <SettingsIcon
            color="white"
            className="app-header-icon" />
        </div>
      }
      <div
        data-test="app-header__noti-icon"
        onClick={ toggleNotificationSidebar }
        className="noti me-2">
        <NotifyBellIcon
          color="white"
          className="app-header-icon cursor-pointer" />
        { newNotificationCount > 0 && <div className="count" data-test="app-header__noti-count">{ newNotificationCount }</div> }
      </div>
      <UserInfo
        id={ accountId }
        name={ accountName }
        role={ accountRole }
        avatar={ accountAvatar }
        history={ history }
      />
      <div
        data-test="app-header__logout-button"
        onClick={ () : void => redirectToPage(USER_LOGOUT_PATH) }
        className="app-header-icon text-primary cursor-pointer d-flex align-items-center justify-content-center simple-icon-logout" />
    </div>
  </Navbar>;
};

export default memo(AppHeader);
