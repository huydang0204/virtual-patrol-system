import { ActivityType } from "../data";

interface ActivityResponse {
  id : string;
  type : ActivityType;
  userId : string;
  description : string;
  createdAt : string;
  user : UserActivityData;
}

interface UserActivityData {
  id : string;
  avatar : string;
  name : string;
  email : string;
  status : string;
  role: string;
  latestLogin : string;
}

export {
  ActivityResponse,
  UserActivityData
};
