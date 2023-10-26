import { EntityOverallData } from "./common";

/**
 * response of site apis
 */
export interface SiteResponse {
    id: string,
    name: string,
    description: string,
    noCameras: number,
    deleted?: boolean,
    cameras?: EntityOverallData[]
}
/**
 * request body of site
 */
export interface SiteRequestBody {

    name: string,
    description: string,
    cameras?: EntityOverallData[]
}
