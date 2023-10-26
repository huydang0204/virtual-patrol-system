import {
  ActivityType,
  FindAndCountResponse
} from "@vps/utils/lib/data";
import { ActivityRepository } from "repositories";

import { getActivityDto } from "./mapper";
import { ActivityResponse } from "@vps/utils/lib/dto/activity";
import { UserData } from "@vps/utils/lib/dto/user";

const listActivity = async (
  limit : number,
  offset : number,
  userId : string,
  types : ActivityType[],
  from : Date,
  to : Date
) : Promise<FindAndCountResponse<ActivityResponse>> => {

  const [
    activities,
    count
  ] = await ActivityRepository.findAndCountWithOptions(
    limit,
    offset,
    userId,
    types,
    from,
    to
  );
  return {
    data : activities.map(getActivityDto),
    count,
    limit,
    offset
  };
};

const logActivity = async (type : ActivityType, user : UserData, targetName ? : string) : Promise<ActivityResponse> => {
  const {
    id : userId,
    name : userName
  } = user;

  let description = userName;
  targetName = targetName || "";
  switch (type) {
    case ActivityType.UserLogin:
      description = `${ userName } logged in`;
      break;
    case ActivityType.UserLogout:
      description = `${ userName } logged out`;
      break;
    case ActivityType.CreateUser:
      description = `${ userName } added new user ${ targetName }`;
      break;
    case ActivityType.BlockUser:
      description = `${ userName } blocked user ${ targetName }`;
      break;
    case ActivityType.ActivateUser:
      description = `${ userName } activated user ${ targetName }`;
      break;
    case ActivityType.DeleteUser:
      description = `${ userName } deleted user ${ targetName }`;
      break;
    case ActivityType.DownloadAnalyticsReport:
      description = `${ userName } downloaded analytics report ${ targetName }`;
      break;
    case ActivityType.StartTask:
      description = `${ userName } started patrolling ${ targetName }`;
      break;
    case ActivityType.DownloadTaskReport:
      description = `${ userName } downloaded patrol report summary ${ targetName }`;
      break;
    case ActivityType.DownloadDailyReport:
      description = `${ userName } downloaded daily report ${ targetName }`;
      break;
    case ActivityType.DownloadMonthlyReport:
      description = `${ userName } downloaded monthly report ${ targetName }`;
      break;
    case ActivityType.CreateRoute:
      description = `${ userName } created patrol route ${ targetName }`;
      break;
    case ActivityType.UpdateRoute:
      description = `${ userName } updated patrol route ${ targetName }`;
      break;
    case ActivityType.DeleteRoute:
      description = `${ userName } deleted patrol route ${ targetName }`;
      break;
    case ActivityType.CreateSop:
      description = `${ userName } created SOP ${ targetName }`;
      break;
    case ActivityType.UpdateSop:
      description = `${ userName } updated SOP ${ targetName }`;
      break;
    case ActivityType.DeleteSop:
      description = `${ userName } deleted SOP ${ targetName }`;
      break;
    case ActivityType.CreateSite:
      description = `${ userName } created site ${ targetName }`;
      break;
    case ActivityType.UpdateSite:
      description = `${ userName } updated site ${ targetName }`;
      break;
    case ActivityType.DeleteSite:
      description = `${ userName } deleted site ${ targetName }`;
      break;
    case ActivityType.CreateAlertType:
      description = `${ userName } created alert type ${ targetName }`;
      break;
    case ActivityType.UpdateAlertType:
      description = `${ userName } updated alert type ${ targetName }`;
      break;
    case ActivityType.DeleteAlertType:
      description = `${ userName } deleted alert type ${ targetName }`;
      break;
  }

  const result = await ActivityRepository.save({
    type,
    userId,
    description
  });
  return getActivityDto(result);
};

export {
  listActivity,
  logActivity
};
