import axios from "axios";
import { configuration } from "config/index";

const witnessAxiosClient = axios.create({
  baseURL : configuration.nxWitnessUrl,
  headers : { "content-type" : "application/json" }
});

witnessAxiosClient.defaults.timeout = 60000;
witnessAxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return {
      data : null,
      error
    };
  }
);

export default witnessAxiosClient;
