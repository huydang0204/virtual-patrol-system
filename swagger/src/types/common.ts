/**
 * success response on logout
 */
export interface SuccessResponse {
  success : boolean
}

/**
 * success response on logout
 */
export interface BooleanResponse {
  data: boolean
}

/**
 * Response with data array, count, limit and offset. Suited for Paging
 */
export interface FindAndCountResponse<T> {
  data: T[],
  count: number,
  limit?: number,
  offset?: number
}

/**
 * Response for how many records have been deleted.
 */
export interface DeleteResponse {
  deletedCount: number
}

/**
 * It stores id and name. Used to minimize entity.
 */
export interface EntityOverallData {
  id: string;
  name: string;
}

/**
 * Response for general count
 */
export interface CountResponse {
  count: number
}

/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

/**
 * @pattern [a-z0-9]+@[a-z]+\.[a-z]{2,3}
 * @example "member@vps.com"
 */
export type email = string;

export const exampleEmail = "member@vps.com";

export const exampleUUID = "52907745-7672-470e-a803-a2f8feb52944";

export const exampleBoolean = true;

export const exampleDate = new Date();

export const exampleCount = 123;
export const exampleNumber = 123;
