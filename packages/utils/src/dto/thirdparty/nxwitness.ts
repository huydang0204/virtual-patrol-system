import { CameraStatus } from "../../data";

type NxWitnessApiResponse<T> = {
  data: T,
  error: {
    code: string
  }
}

type NxWitnessUserInfo = {
  email: string;
  fullName: string;
  id: string;
  name: string;
  permissions: string;
};

type NxWitnessLoginInfo = {
  username: string;
  token: string;
  ageS: string;
  expiresInS: string;
};

type NxWitnessDeviceResponse = {
  id : string,
  name : string,
  status : CameraStatus,
  mac?: string,
  serverId?: string
};

export {
  NxWitnessApiResponse,
  NxWitnessLoginInfo,
  NxWitnessUserInfo,
  NxWitnessDeviceResponse
};
