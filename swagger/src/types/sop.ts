/**
 * response of sop apis
 */
export interface SopResponse {
    id: number,
    name: string,
    type: SopType,
    startDate: Date,
    endDate: Date,
    checklists: string[],
    createdAt: Date,
    deletedAt?: Date
}

/**
 * response of creating sop
 */
export interface SopCreateBody {

    name: string,
    type: SopType,
    startDate: Date,
    endDate?: Date,
    checklists?: string[],
}

/**
 * request body of updating sop
 */
export interface SopUpdateBody {

    name: string,
    type: SopType,
    startDate?: Date,
    endDate?: Date
}

/**
 * sop list as response
 */
export interface SopList {
    data: SopResponse[];
}

/**
 * SOP type
 */
export enum SopType {
    General = "General",
    Special = "Special"
}

export const exampleSopType = SopType.General;