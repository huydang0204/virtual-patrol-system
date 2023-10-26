
import { UUID } from "types/common";
import { SopResponse } from "./sop";

/**
 * response of camera apis
 */
export interface CameraResponse {
    id: UUID;
    name: string;
    address: string;
    tags?: string[];
    lat: string;
    lng: string;
    status: CameraStatus;
    bearing: string;
    siteId: number;
    siteName: string;
    sops: SopResponse[];
}

/**
 * camera list as response
 */
export interface CameraList {
    data: CameraResponse[];
}

/**
 * request body of updating Camera information
 */
export interface CameraUpdateBody {

    name?: string;
    address?: string;
    lat?: string;
    lng?: string;
    bearing?: string;
    region?: string;
    tags?: string[];
    sopIds?: number[];
    siteId?: number;
}

/**
 * Camera Status = "Recording" or "Online" or "Offline"
 */
export type CameraStatus = "Recording" | "Online" | "Offline";

export interface CameraData {
    id: string,
    name?: string,
    snapshotTimeInEpoch: number, // must have
}

export const exampleCameraStatus = "Recording";
