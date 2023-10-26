import axios,
{
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import { configuration } from "config";
import {
  NxWitnessApiResponse,
  NxWitnessDeviceResponse,
  NxWitnessLoginInfo,
  NxWitnessUserInfo
} from "@vps/utils/lib/dto/thirdparty/nxwitness";
import { logger } from "services/logger";
import { getNxWitnessDeviceId } from "utils/data";

const nxWitnessAxiosClient = axios.create({
  baseURL : configuration.nxWitnessUrl,
  headers : { "content-type" : "application/json" }
});

nxWitnessAxiosClient.defaults.timeout = 60000;
nxWitnessAxiosClient.interceptors.response.use(
  (response : AxiosResponse) => {
    return response;
  },
  (error : unknown) => {
    return {
      data : null,
      error
    };
  }
);

export const loginNxWitness = async (
  username : string,
  password : string
) : Promise<NxWitnessApiResponse<NxWitnessLoginInfo>> => {
  const url = "/rest/v1/login/sessions";
  const user = {
    username,
    password,
    setCookie : true
  };
  let result : NxWitnessApiResponse<NxWitnessLoginInfo> = null;
  try {
    result = await nxWitnessAxiosClient.post(url, user);
  } catch (e) {
    logger.error("[services/thirdparty/nxWitness] loginNxWitness failed:", e);
  }
  return result;
};

export const getNxWitnessUserInfo = async (
  token : string,
  username : string
) : Promise<NxWitnessApiResponse<NxWitnessUserInfo>> => {
  const url = `/rest/v1/users/${ username }`;
  let result : NxWitnessApiResponse<NxWitnessUserInfo> = null;
  try {
    result = await nxWitnessAxiosClient.get(url, { headers : { Authorization : `Bearer ${ token }` } });
  } catch (e) {
    logger.error("[services/thirdparty/nxWitness] getNxWitnessUserInfo failed:", e);
  }
  return result;
};

export const getNxWitnessDevices = async (token: string, withParam : string): Promise<NxWitnessApiResponse<NxWitnessDeviceResponse[]>> => {
  const url = "/rest/v1/devices";
  let result : NxWitnessApiResponse<NxWitnessDeviceResponse[]> = null;
  try {
    const config : AxiosRequestConfig = { headers : { Authorization : `Bearer ${token}` } };
    if (!!withParam) {
      config["params"] = { "_with" : withParam };
    }
    result = await nxWitnessAxiosClient.get(url, config);
  } catch (e) {
    logger.error("[services/thirdparty/nxWitness] getNxWitnessDevices failed:", e);
  }
  if (!!result && !!result.data) {
    result.data = result.data.map((aDevice : NxWitnessDeviceResponse) => {
      return {
        ...aDevice,
        id : getNxWitnessDeviceId(aDevice.id)
      };
    });
  }
  return result;
};