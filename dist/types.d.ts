export interface CreateMagicLinkData {
    email: string;
    customToken?: string;
    callbackUrl: string;
}
export interface CreateMagicLinkResponse {
    id: string;
    token: string;
}
export interface ValidateMagicLinkAttemptData {
    id: string;
    token: string;
    noNewSession?: boolean;
}
export interface ValidateMagicLinkAttemptResponse {
    id: string;
    token: string;
}
export interface Session {
    id: string;
    name: string;
    userAgent: string;
    ipAddress: string;
    createdAt: string;
}
export interface RevokeSessionData {
    id: string;
}
interface EmailAddress {
    id: string;
    address: string;
    md5: string;
}
export interface UserData {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: EmailAddress;
    sessions: Session[];
    createdAt: string;
}
export interface ResponseError {
    type: string;
    error: string;
    message: string;
}
export {};
