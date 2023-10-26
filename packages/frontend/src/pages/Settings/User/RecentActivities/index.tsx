import _ from "lodash";
import React, {
  useEffect,
  useState
} from "react";

import { Spinner } from "reactstrap";
import {
  FiDownload,
  FiLogIn,
  FiLogOut,
  FiMapPin,
  FiRotateCw,
  FiSlash,
  FiUserCheck,
  FiUserMinus
} from "react-icons/fi";
import { MdOutlineStart } from "react-icons/md";
import { RiRouteLine } from "react-icons/ri";
import { VscChecklist } from "react-icons/vsc";
import { AiOutlineAlert } from "react-icons/ai";
import PerfectScrollbar from "react-perfect-scrollbar";

import UserActivityCard from "components/UserActivityCard";
import TableDateRangePicker from "components/TableDateRangePicker";

import { ActivityType } from "@vps/utils/lib/data";
import { UserActivityResponse } from "@vps/utils/lib/dto";
import { fetchRecentActivities } from "services/activities";
import {
  getHumanDateFromCalendarDate,
  getTimeAgoFromDateTime
} from "utils/time-format";
import { CalendarDateRange } from "model-type/component-style";

function RecentActivities(props : { height : number, userId? : string, title? : string, isDateFilterEnabled? : boolean; }) : JSX.Element {
  const {
    height,
    userId,
    title,
    isDateFilterEnabled
  } = props;
  const [dateRange,
    setDateRange] = useState<CalendarDateRange>({
      from : null,
      to : null
    });
  const [recentActivities,
    setRecentActivities] = useState<UserActivityResponse[]>([]);
  const [isLoading,
    setIsLoading] = useState<boolean>(true);

  const handleDateRangeSelect = (_selectedDateRange : CalendarDateRange) : void => {
    setDateRange(_selectedDateRange);
  };

  const loadRecentActivities = async () : Promise<void> => {
    setIsLoading(true);

    const recentActivities : string[] = _.without(Object.values(ActivityType), ActivityType.UserLogin);

    if (!!userId) {
      const { data } = await fetchRecentActivities(recentActivities, 100, 0, dateRange, userId);
      setRecentActivities(data);
    } else {
      const { data } = await fetchRecentActivities(recentActivities, 100, 0, dateRange);
      setRecentActivities(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const intervalId = setTimeout(loadRecentActivities, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [isDateFilterEnabled,
    userId,
    dateRange]);

  return (
    <div>
      <div className="bg-gray-999 p-3 rounded-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-white fw-bold">{ !!title ? title : "Recent Activities" }</h5>
          { isDateFilterEnabled && <TableDateRangePicker
            style={ { rightAlign : true } }
            selectedDateRange={ dateRange }
            onDateRangeSelect={ handleDateRangeSelect } /> }
        </div>

        <div style={ { height : `${ height }px` } }>
          { !isLoading ? <PerfectScrollbar
            options={ {
              suppressScrollX : true,
              wheelPropagation : false
            } }>
            { !!recentActivities && recentActivities.length >
              0 ? recentActivities.map((recentLogin : UserActivityResponse, index : number) : JSX.Element => {
                const timeAgo = getTimeAgoFromDateTime(new Date(recentLogin.createdAt));

                // temp solution for getting activity icons
                const Icon = getActivityIcon(recentLogin.type);

                return <div
                  key={ index }
                  className="mb-2">
                  <UserActivityCard
                    Icon={ Icon }
                    subTitle={ recentLogin.description }
                    timeAgo={ timeAgo }
                  />
                </div>;
              }) : <div className="text-white text-center mt-3">No record</div> }
          </PerfectScrollbar> :
            <div className="d-flex justify-content-center">
              <Spinner
                className="m-5"
                color="primary">
                Loading...
              </Spinner>
            </div>
          }
        </div>
      </div>
      { (dateRange.from !== null && dateRange.to !== null) &&
        <div className="mt-2 text-muted text-center">From { getHumanDateFromCalendarDate({
          day : dateRange.from.day,
          month : dateRange.from.month + 1,
          year : dateRange.from.year
        }, false) +
          " to " + getHumanDateFromCalendarDate({
          day : dateRange.to.day,
          month : dateRange.to.month + 1,
          year : dateRange.to.year
        }, false) }</div> }
    </div>
  );
}

export default RecentActivities;

const getActivityIcon = (activityType : ActivityType) : JSX.Element => {
  const color = "#ECECEC";

  switch (activityType) {
    // user
    case ActivityType.UserLogin:
      return <FiLogIn
        color={ color }
        size={ 20 } />;
    case ActivityType.UserLogout:
      return <FiLogOut
        color={ color }
        size={ 20 } />;
    case ActivityType.CreateUser:
      return <FiUserCheck
        color={ color }
        size={ 20 } />;
    case ActivityType.BlockUser:
      return <FiSlash
        color={ color }
        size={ 20 } />;
    case ActivityType.ActivateUser:
      return <FiRotateCw
        color={ color }
        size={ 20 } />;
    case ActivityType.DeleteUser:
      return <FiUserMinus
        color={ color }
        size={ 20 } />;
    // dashboard & report download
    case ActivityType.DownloadAnalyticsReport:
    case ActivityType.DownloadTaskReport:
    case ActivityType.DownloadMonthlyReport:
      // case ActivityType.DownloadDailyReport:
      return <FiDownload
        color={ color }
        size={ 20 } />;
    // task
    case ActivityType.StartTask:
      return <MdOutlineStart
        color={ color }
        size={ 20 } />;
    // route
    case ActivityType.CreateRoute:
    case ActivityType.UpdateRoute:
    case ActivityType.DeleteRoute:
      return <RiRouteLine
        color={ color }
        size={ 20 } />;
    // sop
    case ActivityType.CreateSop:
    case ActivityType.UpdateSop:
    case ActivityType.DeleteSop:
      return <VscChecklist
        color={ color }
        size={ 20 } />;
    // site
    case ActivityType.CreateSite:
    case ActivityType.UpdateSite:
    case ActivityType.DeleteSite:
      return <FiMapPin
        color={ color }
        size={ 20 } />;
    // alert type
    case ActivityType.CreateAlertType:
    case ActivityType.UpdateAlertType:
    case ActivityType.DeleteAlertType:
      return <AiOutlineAlert
        color={ color }
        size={ 20 } />;
  }
};