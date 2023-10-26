import React, {
  useEffect,
  useState
} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import UserActivityCard from "components/UserActivityCard";

import { ActivityType } from "@vps/utils/lib/data";
import { UserActivityResponse } from "@vps/utils/lib/dto";
import { getTimeAgoFromDateTime } from "utils/time-format";
import { fetchRecentActivities } from "services/activities";
import { Spinner } from "reactstrap";

function RecentLogins(props : { height : number }) : JSX.Element {
  const { height } = props;

  const [recentLogins,
    setRecentLogins] = useState<UserActivityResponse[]>([]);
  const [isLoading,
    setIsLoading] = useState<boolean>(false);

  const loadRecentLogins = async () : Promise<void> => {
    setIsLoading(true);

    const { data } = await fetchRecentActivities([ActivityType.UserLogin as string], 100, 0);
    setRecentLogins(data);

    setIsLoading(false);
  };

  useEffect(() => {
    loadRecentLogins();
  }, []);

  return (
    <div className="bg-gray-999 p-3 rounded-3">
      <h5 className="text-white fw-bold mb-2">Recent Logins</h5>
      <div style={ { height : `${ height }px` } }>
        { !isLoading ? <PerfectScrollbar
          options={ {
            suppressScrollX : true,
            wheelPropagation : false
          } }>
          { !!recentLogins && recentLogins.length > 0 ? recentLogins.map((
            recentLogin : UserActivityResponse,
            index : number
          ) : JSX.Element => {
            const timeAgo = getTimeAgoFromDateTime(new Date(recentLogin.createdAt));
            return <div
              className="mb-2"
              key={ index }>
              <UserActivityCard
                avatar={ recentLogin.user?.avatar }
                title={ recentLogin.user?.name }
                subTitle={ recentLogin.user?.email }
                description={ recentLogin.user?.role }
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
  );
}

export default RecentLogins;