import moment from "moment-timezone";
import React, {
  useState,
  useEffect
} from "react";
import { useHistory } from "react-router-dom";
import { Alert } from "reactstrap";
import { BsClock } from "react-icons/bs";
import {
  FiAlertTriangle,
  FiX
} from "react-icons/fi";

import { NewNotificationMessage } from "data/mqtt";
import { convertSecondsToHumanReadableFormat } from "utils/date-time";
import { 
  NotificationRelatedDataType,
  NotificationType 
} from "@vps/utils/lib/data";
import {
  REPORT_DAILY_DETAIL_PATH,
  REPORT_MONTHLY_DETAIL_PATH,
  REPORT_PATH,
  VIRTUAL_PATROL_PATH
} from "data/route-path";
import { IoLocationOutline } from "react-icons/io5";

const NotificationPopup = (props : { notificationMsg : NewNotificationMessage }) : JSX.Element => {
  const history = useHistory();

  const [
    isOpen,
    setIsOpen
  ] = useState(false);
  const { notificationMsg } = props;

  const isNotiInComingTask = !!notificationMsg && notificationMsg.type === NotificationType.InComingTask;
  const isNotiMonthlyReport = !!notificationMsg && notificationMsg.type === NotificationType.MonthlyReportReady;
  const isNotiDailyReport = !!notificationMsg && notificationMsg.type === NotificationType.DailyReportReady;

  const createdAt = (isNotiDailyReport || isNotiMonthlyReport) ? notificationMsg.detailData[NotificationRelatedDataType.Report]["createdAt"] : "-";

  const handleNotiClick = () : void => {
    if (notificationMsg.type === NotificationType.InComingTask) {
      history.push({ pathname : VIRTUAL_PATROL_PATH });
    } else if (notificationMsg.type === NotificationType.MonthlyReportReady) {
      const reportDetail = notificationMsg.detailData[NotificationRelatedDataType.Report];
      let path = REPORT_PATH;
      const reportId = reportDetail["id"];
      if (!!reportId) {
        path = REPORT_MONTHLY_DETAIL_PATH.replace(":id", reportId);
      }
      history.push(path);
    } else if (notificationMsg.type === NotificationType.DailyReportReady) {
      const reportDetail = notificationMsg.detailData[NotificationRelatedDataType.Report];
      let path = REPORT_PATH;
      const reportId = reportDetail["id"];
      if (!!reportId) {
        path = REPORT_DAILY_DETAIL_PATH.replace(":id", reportId);
      }
      history.push(path);
    }
  };

  const handleClose = () : void => setIsOpen(false);

  useEffect(() => {
    let timeout;
    if (!!notificationMsg) {
      setIsOpen(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [notificationMsg]);

  return (
    <div className={ `notification-popup ${ isOpen ? "slide-out" : "slide-in" }` } onClick={ handleNotiClick }>
      <Alert className="alert-container">
        <div
          className="dismiss-icon"
          onClick={ handleClose }
          title="Dismiss">
          <FiX size={ 18 } />
        </div>
        <div>
          {/* name */ }
          <p
            className="text-black font-weight-bold mb-2"
            style={ { fontSize : "0.85rem" } }>
            { isNotiInComingTask && notificationMsg?.detailData["RouteTask"]["name"] }
            { (isNotiDailyReport || isNotiMonthlyReport) && notificationMsg?.description }
          </p>

          {/* time range */ }
          {isNotiInComingTask &&
            <div className="d-flex gap-1 align-items-center mb-1 text-gray-600 mb-2">
              <BsClock size={ 15 } />
              <div>{ convertSecondsToHumanReadableFormat(notificationMsg?.detailData["RouteTask"]["startTime"] + "") }
                — { convertSecondsToHumanReadableFormat(notificationMsg?.detailData["RouteTask"]["endTime"] + "") }</div>
            </div>
          }
          {(isNotiDailyReport || isNotiMonthlyReport) &&
            <div className="d-flex align-items-center gap-2">
              <IoLocationOutline size={ 15 } />
              { notificationMsg?.detailData["Site"]["name"] || "—" }
            </div>
          }
        </div>

        {/* alert description */ }
        {isNotiInComingTask &&
          <div className="d-flex gap-1 align-items-start">
            <div className="d-flex flex-grow-0 flex-shrink-0">
              <FiAlertTriangle
                size={ 15 }
                color="red" />
            </div>
            <div className="text-danger flex-grow-1">
              { notificationMsg?.description }
            </div>
          </div>
        }

        {(isNotiDailyReport || isNotiMonthlyReport) && <div className="text-success">{ moment(createdAt, "DD/MM/yyyy").format("DD MMMM, YYYY") }</div>}
      </Alert>
    </div>
  );
};

export default NotificationPopup;
