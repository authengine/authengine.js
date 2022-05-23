import { AxiosRequestConfig } from "axios";
import { CreateMagicLinkData, ValidateMagicLinkAttemptData, ValidateMagicLinkAttemptResponse, RevokeSessionData } from "./types";
export declare class MagicLinkClient {
    private config;
    constructor(config: ClientConfig);
    send(data: CreateMagicLinkData): Promise<CreateMagicLinkData>;
    loginWithToken(data: ValidateMagicLinkAttemptData): Promise<ValidateMagicLinkAttemptResponse>;
}
export declare class UserClient {
    private config;
    constructor(config: ClientConfig);
    get session(): SessionClient;
    get isAuthenticated(): boolean;
    get(): Promise<unknown>;
    data(): Promise<unknown>;
    logout(): Promise<unknown>;
}
export declare class SessionClient {
    private config;
    constructor(config: ClientConfig);
    get token(): string;
    list(): Promise<unknown>;
    revoke(data: RevokeSessionData): Promise<unknown>;
}
export interface ClientConfig {
    apiUrl: string;
    publicKey: string;
    apiRequest?: <T>(config: AxiosRequestConfig) => Promise<T>;
}
export default class Client {
    config: ClientConfig;
    constructor(config: ClientConfig);
    get magicLink(): MagicLinkClient;
    get user(): UserClient;
}
