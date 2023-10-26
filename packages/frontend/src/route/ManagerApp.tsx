import React, {
  memo,
  useEffect,
  useRef
} from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch
} from "react-router-dom";

import {
  DASHBOARD_PATH,
  LOGIN_PATH,
  PATROL_LIST_PATH,
  SETTINGS_PATH,
  TASK_LIST_PATH,
  PATROL_CREATE_PATH,
  PATROL_MANAGE_PATH,
  VIRTUAL_PATROL_PATH,
  USER_PROFILE_PATH,
  USER_LOGOUT_PATH,
  PAGE_NOT_FOUND_PATH,
  REPORT_PATH,
  REPORT_MONTHLY_DETAIL_PATH,
  REPORT_DAILY_DETAIL_PATH,
  REPORT_TASK_DETAIL_PATH
} from "data/route-path";
import useUserAccount from "hooks/useUserAccount";
import { UserAccountModel } from "model/user-account";
import { connectMqtt } from "services/mqtt";

import DashboardPage from "pages/Dashboard";
import VirtualPatrolPage from "pages/Patrolling";
import VirtualPatrolCreatePage from "pages/PatrolList/VirtualPatrolRouteCreate";
import VirtualPatrolRouteManagePage from "pages/PatrolList/VirtualPatrolRouteManage";
import PatrolListPage from "pages/PatrolList";
import TaskListPage from "pages/TaskList";
import SettingsPage from "pages/Settings";
import UserProfile from "pages/UserProfile";
import LogoutPage from "pages/Logout";
import ReportPage from "pages/Report";
import DetailsMonthlyReport from "pages/Report/DetailsMonthlyReport";
import DetailsDailyReport from "pages/Report/DetailsDailyReport";
import DetailsTaskReport from "pages/Report/DetailsTaskReport";

function ManagerApp({ history } : { history : RouteComponentProps["history"] }) : JSX.Element {
  const { accountId } : UserAccountModel = useUserAccount();
  const _inDirecting = useRef<boolean>(false);

  useEffect(() => {
    if (!_inDirecting.current && !accountId) {
      _inDirecting.current = true;
      history && history.push(LOGIN_PATH);
    } else {
      connectMqtt(accountId);
    }
  }, [
    accountId,
    history
  ]);

  return (
    <>
      <Switch>
        {/* Dashboard */ }
        <Route
          path={ DASHBOARD_PATH }
          component={ DashboardPage } />

        {/* Route */ }
        <Route
          path={ PATROL_MANAGE_PATH }
          component={ VirtualPatrolRouteManagePage } />
        <Route
          path={ PATROL_CREATE_PATH }
          component={ VirtualPatrolCreatePage } />
        <Route
          path={ VIRTUAL_PATROL_PATH }
          component={ VirtualPatrolPage } />

        {/* Patrolling */ }
        <Route
          path={ PATROL_LIST_PATH }
          component={ PatrolListPage } />

        {/* Task & Report */ }
        <Route
          path={ TASK_LIST_PATH }
          component={ TaskListPage } />

        {/* Settings */ }
        <Route
          path={ SETTINGS_PATH }
          component={ SettingsPage } />

        <Route
          path={ USER_LOGOUT_PATH }
          component={ LogoutPage } />

        <Route
          path={ USER_PROFILE_PATH }
          component={ UserProfile } />
        
        {/* Reports */}
        <Route
          path={ REPORT_MONTHLY_DETAIL_PATH }
          component={ DetailsMonthlyReport } />
        <Route
          path={ REPORT_DAILY_DETAIL_PATH }
          component={ DetailsDailyReport }
        />
        <Route
          path={ REPORT_TASK_DETAIL_PATH }
          component={ DetailsTaskReport }
        />
        <Route
          path={ REPORT_PATH }
          component={ ReportPage } />

        {/* Page Not Found */ }
        <Redirect to={ PAGE_NOT_FOUND_PATH } />
      </Switch>
    </>
  );
}

export default memo(ManagerApp);
