import {
  Activity,
  User
} from "entities";
import {
  ActivityResponse,
  UserActivityData
} from "@vps/utils/lib/dto/activity";

export const getActivityDto = (activity : Activity) : ActivityResponse => {
  if (!activity) return null;
  const {
    id,
    type,
    userId,
    description,
    createdAt,
    user
  } = activity;

  return {
    id,
    type,
    userId,
    description,
    createdAt : createdAt.toISOString(),
    user : getUserActivityData(user)
  };
};

const getUserActivityData = (user : User) : UserActivityData => {
  if (!user) return null;
  const {
    id,
    avatar,
    name,
    email,
    status,
    role,
    latestLogin
  } = user;

  return {
    id,
    avatar,
    name,
    email,
    status,
    role : role?.name,
    latestLogin : latestLogin.toISOString()
  };
};
