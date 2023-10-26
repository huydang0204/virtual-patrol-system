import React, {
  useEffect,
  useState
} from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Spinner
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  BsClock,
  BsFillCircleFill
} from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import {
  IoClose, IoLocationOutline
} from "react-icons/io5";
import { IoMdNotificationsOff } from "react-icons/io";

import {
  deleteAllNotis,
  deleteNotiById,
  fetchNotifications,
  readNotiById
} from "services/notification";
import {
  AppNotificationResponse,
  RouteTaskResponse,
  SiteResponse
} from "@vps/utils/lib/dto";
import { 
  NotificationRelatedDataType,
  NotificationType,
  NotificationStatus 
} from "@vps/utils/lib/data";
import { getFormattedDate } from "utils/time-format";
import { convertSecondsToHumanReadableFormat } from "utils/date-time";
import {
  REPORT_DAILY_DETAIL_PATH,
  REPORT_MONTHLY_DETAIL_PATH,
  REPORT_PATH,
  VIRTUAL_PATROL_PATH
} from "data/route-path";

const NotificationSidebar = ({
  isOpen, onToggleSidebar
}) => {
  const history = useHistory();

  const [isLoading,
    setIsLoading] = useState(true);
  const [notifications,
    setNotifications] = useState<AppNotificationResponse[]>([]);

  // fetch and read notis
  const fetchNotis = async () : Promise<void> => {
    const { data : notis } = await fetchNotifications();
    setNotifications(notis);
    setIsLoading(false);

    // read notis
    // await readNotifications(); // disable read all notification when open noti sidebar
  };

  const handleReadNoti = async (noti : AppNotificationResponse) : Promise<void> => {
    if (noti.status === NotificationStatus.New) {
      await readNotiById(noti.id);
      onToggleSidebar();

      if (noti.type === NotificationType.InComingTask) {
        history.push({ pathname : VIRTUAL_PATROL_PATH });
      } else if (noti.type === NotificationType.MonthlyReportReady) {
        const reportDetail = noti.detailData[NotificationRelatedDataType.Report];

        let path = REPORT_PATH;
        const reportId = reportDetail["id"];
        if (!!reportId) {
          path = REPORT_MONTHLY_DETAIL_PATH.replace(":id", reportId);
        }
        history.push(path);
      } else if (noti.type === NotificationType.DailyReportReady) {
        const reportDetail = noti.detailData[NotificationRelatedDataType.Report];
        let path = REPORT_PATH;
        const reportId = reportDetail["id"];
        if (!!reportId) {
          path = REPORT_DAILY_DETAIL_PATH.replace(":id", reportId);
        }
        history.push(path);
      }
    }
  };

  // delete noti by id
  const handleNotiDelete = async (id : string) : Promise<void> => {
    const originalNotis = notifications;

    const notis = notifications.filter(noti => noti.id !== id);
    setNotifications(notis);

    const {
      data,
      errors
    } = await deleteNotiById(id);

    if (!data || !!errors) {
      alert("Something went wrong while deleting a notification.");
      setNotifications(originalNotis);
    }
  };

  // delete all notis
  const handleAllNotisDelete = async () : Promise<void> => {
    const originalNotis = notifications;

    setNotifications([]);

    const {
      data,
      errors
    } = await deleteAllNotis();

    if (!data || !!errors) {
      alert("Something went wrong while deleting notifications.");
      setNotifications(originalNotis);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotis();
    }
  }, [isOpen]);

  return (
    <div id="noti-side-bar">
      <PerfectScrollbar>
        <div className={ `notification-sidebar ${ isOpen ? "open" : "" } p-3 pl-1 pt-0` }>
          <div className="noti-header d-flex justify-content-between align-items-center">
            <h4 className="text-primary">{ !!notifications ? notifications.length > 99 ? "99+" : notifications.length : 0 } Notifications</h4>
            <Button
              onClick={ handleAllNotisDelete }
              disabled={ !!notifications && notifications.length === 0 }
              color="primary"
              outline
              className="rounded-3"
              size="sm">Clear All</Button>
          </div>
          { isLoading ?
            <div className="d-flex justify-content-center mt-5">
              <Spinner color="secondary">
                Loading...
              </Spinner>
            </div>
            :
            notifications.length === 0 ?
              <div className="no-notis text-gray">
                <IoMdNotificationsOff size={ 30 } />
                <span>No notifications yet</span>
              </div>
              :
              <div className="noti-content mt-2">
                { notifications.map((noti : AppNotificationResponse, index : number) : JSX.Element => {
                  // if (noti.type === NotificationType["InComingTask"] && !!noti.detailData) {
                  if (!!noti.detailData) {
                    let routeDetail = null;
                    const isNotiInComingTask = noti.type === NotificationType.InComingTask;
                    const isNotiMonthlyReport = noti.type === NotificationType.MonthlyReportReady;
                    const isNotiDailyReport = noti.type === NotificationType.DailyReportReady;

                    if (isNotiInComingTask) {
                      routeDetail = noti.detailData[NotificationRelatedDataType.RouteTask] as RouteTaskResponse;
                    } else if (isNotiMonthlyReport || isNotiDailyReport) {
                      routeDetail = noti.detailData[NotificationRelatedDataType.Site] as SiteResponse;
                    }

                    return (
                      <div
                        key={ index }
                        className="d-flex align-items-center gap-1 noti-item-wrapper">
                        {/* unread symbol */ }
                        {
                          <div
                            className={ `${ noti.status ===
                            NotificationStatus["New"] ? "unread-symbol" : "read-symbol" }` }>
                            <BsFillCircleFill size={ 10 } />
                          </div>
                        }

                        <div className="noti-item cursor-pointer d-flex justify-content-between align-items-start rounded-3 p-3 mb-2">
                          <div style={{ flexGrow : 1 }} onClick={() => handleReadNoti(noti)}>

                            {/* name */ }
                            <p
                              className="text-black font-weight-bold"
                              style={ { fontSize : "0.85rem" } }>
                              { isNotiInComingTask && routeDetail.name }
                              { isNotiMonthlyReport && "Monthly report is ready to view" }
                              { isNotiDailyReport && "Daily report is ready to view" }
                            </p>

                            {isNotiInComingTask &&
                              <>
                                {/* time range */ }
                                <div className="d-flex gap-1 align-items-center mb-1 text-gray-600 mb-2">
                                  <BsClock size={ 15 } />
                                  <div>{ convertSecondsToHumanReadableFormat(routeDetail.startTime.toString()) } — { convertSecondsToHumanReadableFormat(routeDetail.endTime.toString()) }</div>
                                </div>

                                {/* alert description */ }
                                <div className="d-flex gap-1 align-items-start">
                                  <div className="d-flex flex-grow-0 flex-shrink-0">
                                    <FiAlertTriangle
                                      size={ 15 }
                                      color="red" />
                                  </div>
                                  <div className="text-danger flex-grow-1">
                                    { noti.description }
                                  </div>
                                </div>
                              </>
                            }

                            {(isNotiDailyReport || isNotiMonthlyReport) &&
                              <div className="d-flex align-items-center gap-2">
                                <IoLocationOutline size={ 15 } />
                                { routeDetail.name }
                              </div>
                            }

                          </div>

                          {/* occurence date */ }
                          <small className="text-secondary">
                            { isNotiInComingTask && getFormattedDate(new Date(routeDetail.occurrenceDate) as Date) }
                            { (isNotiDailyReport || isNotiMonthlyReport) && getFormattedDate(noti.createdAt as Date) }
                          </small>

                          {/* delete noti */ }
                          <div onClick={ () : void => {
                            handleNotiDelete(noti.id);
                          } }>
                            <IoClose className="btn-clear-noti-item" title="Clear" />
                          </div>
                        </div>
                      </div>
                    );
                  }
                }) }
              </div>
          }
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default NotificationSidebar;
