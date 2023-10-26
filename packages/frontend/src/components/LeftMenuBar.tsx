import React, { memo } from "react";
import { useHistory } from "react-router-dom";
import {
  Nav, NavItem 
} from "reactstrap";

import useUserAccount from "hooks/useUserAccount";
import AppSidebarCollapseIcon from "./icons/AppSidebarCollapseIcon";

import { UserAccountModel } from "model/user-account";
import {
  LEFT_MAIN_MENU, ROUTE_PATH_INFO, RouteInfo 
} from "data/route-path";

function LeftMenuBar({ toggleMenu }): JSX.Element {
  const history = useHistory();
  const currentPath: string = history.location.pathname;

  const { role }: UserAccountModel = useUserAccount();

  const onMainClick = (path: string): void => {
    history.push(path);
  };

  return (
    <div id="left-sidebar">
      <div className="show-menu">
        <div className="app-logo">
          <img
            className="logo-large"
            src="/assets/images/company-logo.png"
            alt="VPS Logo"
          />
        </div>

        {/* <PerfectScrollbar> */}
        <Nav vertical>
          {!!role
            ? LEFT_MAIN_MENU[role].map((key: string) => {
              const active = currentPath === key || currentPath.startsWith(key);
              const activeClass = active ? " active" : "";

              const {
                path, title : name, Icon 
              }: RouteInfo = ROUTE_PATH_INFO[key];

              return (
                <NavItem key={key} className="nav-item" onClick={(): void => onMainClick(path)}>
                  <div className={`tab${activeClass}`}>
                    <div className={`menu-icon${activeClass}`}>{Icon}</div>
                    <div data-test="left-menu-bar__item" className="name">{name}</div>
                  </div>
                </NavItem>
              );
            })
            : null}
        </Nav>
        {/* </PerfectScrollbar> */}

        <div onClick={ (e) => toggleMenu(e, true, false) }>
          <AppSidebarCollapseIcon color="gray" className="left-sidebar-toggle-button" />
        </div>
      </div>
    </div>
  );
}

export default memo(LeftMenuBar);
