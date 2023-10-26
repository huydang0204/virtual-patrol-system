/**
 * response of alert type apis
 */
export interface AlertTypeResponse {
    id: string;
    type: string;
    priority: string;
    description: string;
    actionTaken: string[];
    imageUrl: string;
    deletedAt?: Date
}

/**
 * alert type list as response
 */
export interface AlertTypeList {
    data: AlertTypeResponse[];
}

/**
 * response of alert type apis
 */
export interface AlertTypeRequestBody {

    type: string;
    description: string;
    actionTaken: string[];
    imageUrl: string;

}