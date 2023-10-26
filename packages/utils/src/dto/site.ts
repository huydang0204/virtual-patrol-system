import { EntityOverallData } from "../data";
import { Camera } from "../entities";

interface SiteResponse {
  id : string,
  name : string,
  description : string,
  noCameras : number,
  deleted ?: boolean,
  cameras ?: EntityOverallData<Camera>[]
}

enum SiteError {
  InvalidId = "InvalidId",
  NotFound = "NotFound"
}

export {
  SiteResponse,
  SiteError
};
