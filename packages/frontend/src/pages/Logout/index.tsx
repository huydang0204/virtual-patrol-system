import React, { memo } from "react";
import { Button } from "reactstrap";
import moment from "moment-timezone";

import PageFooter from "components/PageFooter";
import useUserAccount from "hooks/useUserAccount";

import { logout } from "services/auth-account";
import { UserAccountModel } from "model/user-account";

import {
  convertTimeToCompleteDateTimeFormat,
  getCurrentTimeInTimeZone
} from "utils/time-format";
import { calculateTimeDiffBetweenDateTimes } from "utils/date-time";

function LogoutPage() : JSX.Element {
  const {
    name,
    latestLogin
  } : UserAccountModel = useUserAccount();

  return (
    <div id="logout-page">
      <div className="company-logo">
        <img
          className="logo"
          src="/assets/images/company-logo.png" />
      </div>

      <div className="logout-details">
        <h3 className="mb-2">Successful Log Out</h3>
        <span className="text-muted">{ `You have successfully logged out of account (${ name }), below are your last session details.` }</span>

        <div className="mt-3 border rounded-3 p-3">
          <div className="my-3">
            <h5>Login</h5>
            <p className="mt-1">{ convertTimeToCompleteDateTimeFormat(latestLogin) }</p>
          </div>

          <div className="mb-3">
            <h5>Logout</h5>
            <p className="mt-1">{ getCurrentTimeInTimeZone() }</p>
          </div>

          <div>
            <h5>Duration</h5>
            <p className="mt-1">{ calculateTimeDiffBetweenDateTimes(latestLogin, moment().toString()) }</p>
          </div>
        </div>

        <Button
          className="btn-return-to-login rounded-3 mt-2"
          color="primary"
          onClick={ logout }>Return to Login</Button>
      </div>


      <PageFooter />
    </div>
  );
}

export default memo(LogoutPage);