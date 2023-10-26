import { configuration } from "../config";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";

class ApiInstance {

  public apiInstance : AxiosInstance;
  public jwtToken : string;
  public userId : string;

  constructor() {
    const ApiBaseUrl = configuration.API_BASE_URL + "/apis";
    this.apiInstance = axios.create({
      baseURL : ApiBaseUrl,
      timeout : 10000
    });

  }

  public async login() : Promise<void> {
    const response = await this.apiInstance.request({
      url : "/user/login",
      method : "post",
      headers : { "Content-Type" : "application/json" },
      data : {
        email : "admin@vps.com",
        password : "admin"
      }
    });

    this.jwtToken = response.data.jwt;
    this.userId = response.data.user.id;
  }

  public async request(req : AxiosRequestConfig) : Promise<AxiosResponse> {
    return await this.apiInstance.request(req);
  }
}

export default new ApiInstance();
