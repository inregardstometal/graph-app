import { firestore } from 'firebase-admin';

declare type IApiError = {
    message: string;
    code: number;
};
interface IApiResponse {
    error?: IApiError;
}

interface IDealership {
    id: string;
    name: string;
    address: DealershipAddress;
    subscription: any;
    owner: string;
    roles: IDealershipRole[];
    dateCreated: string;
    brandImage: string;
    websiteUrl: string;
    appointmentUrl: string;
    hexColorValuePrimary: string;
    hexColorValueSecondary: string;
}
interface DealershipAddress {
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    state: string;
}
interface IDealershipStaff {
    [userId: string]: {
        roles: {
            [key in DealershipRoles]?: boolean;
        };
        dateJoined: string;
    };
}
declare type IDealershipRole = {
    admin: boolean;
    inventory: boolean;
    marketing: boolean;
    sales: boolean;
};
declare function isDealershipRoles(val: string): val is DealershipRoles;
declare type DealershipRoles = "admin" | "inventory" | "marketing" | "sales";

declare type SegmentCut = {
    start: number;
    end: number;
};
interface ISegment {
    file: File;
    filename: string;
    position: number | null;
}
interface IVideoSegment extends ISegment {
    cuts?: SegmentCut[];
}
interface IImageSegment extends ISegment {
    duration: number;
}
interface IAudioSegment extends ISegment {
    start: number;
    stop: number;
    volume: number;
    cuts?: SegmentCut[];
}
interface IOverlaySegment extends ISegment {
    source: any;
    start: number;
    end: number;
}
declare function instanceOfVideoSegment(segment: ISegment): segment is IVideoSegment;
declare function instanceOfImageSegment(segment: ISegment): segment is IImageSegment;

/**
 * Video resolution.
 */
declare type Resolution = [width: number, height: number];
/**
 * Video rendering options.
 */
interface VideoOptions {
    fps: number;
    resolution: Resolution;
}
/**
 * Video.
 */
interface IVideo {
    options: VideoOptions;
    segments: ISegment[];
}

/**
 * Render Job as an object in the database.
 */
interface IRenderJob {
    id: string;
    request: IVideo | null;
    status: RenderJobStatus;
    errorMessage: string | null;
    progress: number;
    location: string | null;
    dateStarted: string;
    dateCompleted: string | null;
    startedBy: string;
}
/**
 * Generate a path to the location where this RenderJob exists in the database.
 * @note Should be used for both Database and Firestore.
 * @param {string} dealershipId The dealership for which this user works at.
 * @param {string} jobId The GUID of the render id.
 * @returns {string} Full path from the root of the database to the location of this render job.
 */
declare function generateRenderJobDatabasePath(dealershipId: string, jobId: string): string;
/**
 * Generate a path to the Object Storage (GCS) location where this rendered video exists.
 * @note Should be used for only storage.
 * @param {string} dealershipId The dealership for which this user works at.
 * @returns {string} Full path from the root of the storage bucket to the location of this render.
 */
declare function generateRenderJobStoragePath(dealershipId: string): string;
/**
 * Create a default, uninitialized RenderJob object. It's the following:
 *  {
 *      dateStarted: new Date(Date.now()).toISOString(),
 *      progress: 0,
 *      request: undefined,
 *      status: "uninitialized",
 *      startedBy: "you shouldn't see this!"
 *  }
 * @returns RenderJob shaped object
 */
declare function generateDefaultRenderJob(): IRenderJob;
declare type RenderJobStatus = "uninitialized" | "pending" | "started" | "rendering" | "uploading" | "complete" | "error";

interface IUser {
    id: string;
    orgs: {
        [organization_guid: string]: boolean;
    };
    deleted: boolean;
    iconUrl?: string;
    firstName?: string;
    lastName?: string;
    accountComplete?: boolean;
    joinedAsDealership?: boolean;
}

/**
 * Request and response for server calls to authenticating a user.
 */
interface IAuthenticationResponse extends IApiResponse {
    user?: IUser;
}

declare const dealershipConverter: firestore.FirestoreDataConverter<IDealership>;
declare const dealershipStaffConverter: firestore.FirestoreDataConverter<IDealershipStaff>;
/**
 * Request and response types for getting a Dealership entity. This should originate from a user
 * who is trying to get the Dealership object.
 */
interface IDealershipGetRequest {
    dealership: IDealership;
}
interface IDealershipGetResponse extends IApiResponse {
    dealership?: IDealership;
}
/**
 * Request and response types for creating a new Dealership entity. This should originate from a new
 * AutoReel user who is registering their Dealership for the first time.
 */
interface IDealershipCreateRequest {
    dealership: IDealership;
}
interface IDealershipCreateResponse extends IApiResponse {
    dealership?: IDealership;
}
interface IAddEmployeeToDealershipRequest {
    email: string;
    dealershipId: string;
    roles: IDealershipRole;
}
interface IAddEmployeeToDealershipResponse extends IApiResponse {
    user?: IUser;
}
/**
 * Request and response types for updating a Dealership entity. This will have to come from someone
 * who has permission to edit such fields of a Dealership in the database.
 */
interface IDealershipUpdateRequest {
}
interface IDealershipUpdateResponse extends IApiResponse {
    dealership?: IDealership;
}
/**
 * Request and response types for updating a Dealership entity. This will have to come from someone
 * who has permission to delete a Dealership in the database.
 */
interface IDealershipDeleteRequest {
}
interface IDealershipDeleteResponse extends IApiResponse {
}

/**
 * NOTE: The FileApi requires no additional server-side code, so this file is left
 *       only for documentation.
 */

declare function GenerateDealershipImageRootDir(id: string): string;
declare function GenerateDealershipVideoRootDir(id: string): string;
declare function GenerateDealershipRenderRootDir(id: string): string;
declare function GenerateDealershipWalkaroundRootDir(id: string): string;
declare function GenerateUserImageRootDir(id: string): string;
declare function GenerateUserVideoRootDir(id: string): string;

/**
 * Response sent from the server in response to a {@link IRenderJobRequest}.
 */
interface IRenderJobResponse extends IApiResponse {
    jobId?: string;
    fullPath?: string;
}
/**
 * Request object that is submitted when creating a new RenderJob on the server.
 */
interface IRenderJobRequest {
    video: IVideo;
    dealershipId: string;
}

declare const userConverter: firestore.FirestoreDataConverter<IUser>;
/**
 * Request and response data types for getting a user. This should originate from a request that is
 * trying to get a user object.
 */
interface IUserGetRequest {
    id: IUser["id"];
}
interface IUserGetResponse extends IApiResponse {
    user?: IUser;
}
/**
 * Request and response data types for creating a user invite. This should originate from a dealership
 * admin or manager account who is inviting their employees.
 */
interface IUserCreateInviteRequest {
    user: IUser;
}
interface IUserCreateInviteResponse extends IApiResponse {
    user?: IUser;
}
/**
 * Request and response data types for creating AutoReel users. This should originate from a user who is signing
 * up for AutoReel for the first time.
 * @NOTE This is likely going to apply only to users who intend to create a new dealership.
 */
interface IUserCreateRequest {
    email: string;
    password: string;
    user: IUser;
}
interface IUserCreateResponse extends IApiResponse {
    user?: IUser;
}
/**
 * Request and response data types for updating an AutoReel user. This should originate from a user who wants to
 * update their name or some other information that is in their power.
 */
interface IUserUpdateRequest {
    user: IUser;
}
interface IUserUpdateResponse extends IApiResponse {
    user?: IUser;
}
/**
 * Request to add an organization to a user
 */
interface IUserOrgAddRequest {
    userId: string;
    dealershipId: string;
}
interface IUserOrgAddResponse extends IApiResponse {
}
/**
 * Request to get all the roles a user is a part of
 */
interface IUserGetRolesRequest {
    userId: string;
}
interface IUserGetRolesResponse extends IApiResponse {
    roles: IDealershipRole;
}

/**
 * Converts JSON/objects to base64 then URI encoded strings
 * @param data Either a JSON object or a Javascript object
 * @returns A URI and base643 encoded string
 */
declare const JSONtoURI: (data: JSON | object) => string;
declare const GetClientUrl: () => string;

export { DealershipAddress, DealershipRoles, GenerateDealershipImageRootDir, GenerateDealershipRenderRootDir, GenerateDealershipVideoRootDir, GenerateDealershipWalkaroundRootDir, GenerateUserImageRootDir, GenerateUserVideoRootDir, GetClientUrl, IAddEmployeeToDealershipRequest, IAddEmployeeToDealershipResponse, IApiError, IApiResponse, IAudioSegment, IAuthenticationResponse, IDealership, IDealershipCreateRequest, IDealershipCreateResponse, IDealershipDeleteRequest, IDealershipDeleteResponse, IDealershipGetRequest, IDealershipGetResponse, IDealershipRole, IDealershipStaff, IDealershipUpdateRequest, IDealershipUpdateResponse, IImageSegment, IOverlaySegment, IRenderJob, IRenderJobRequest, IRenderJobResponse, ISegment, IUser, IUserCreateInviteRequest, IUserCreateInviteResponse, IUserCreateRequest, IUserCreateResponse, IUserGetRequest, IUserGetResponse, IUserGetRolesRequest, IUserGetRolesResponse, IUserOrgAddRequest, IUserOrgAddResponse, IUserUpdateRequest, IUserUpdateResponse, IVideo, IVideoSegment, JSONtoURI, RenderJobStatus, Resolution, SegmentCut, VideoOptions, dealershipConverter, dealershipStaffConverter, generateDefaultRenderJob, generateRenderJobDatabasePath, generateRenderJobStoragePath, instanceOfImageSegment, instanceOfVideoSegment, isDealershipRoles, userConverter };
