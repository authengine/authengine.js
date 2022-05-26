import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { SESSION_TOKEN_LOCAL_STORAGE_KEY } from "./consts";
import {
  CreateMagicLinkData,
  CreateMagicLinkResponse,
  ValidateMagicLinkAttemptData,
  ValidateMagicLinkAttemptResponse,
  RevokeSessionData,
  UserData,
  ResponseError,
} from "./types";

export class MagicLinkClient {
  private config: ClientConfig;
  constructor(config: ClientConfig) {
    this.config = config;
  }

  public send(data: CreateMagicLinkData) {
    return this.config.apiRequest<CreateMagicLinkData>({
      method: "POST",
      url: "/public/auth/magic-link",
      data,
    });
  }

  public loginWithToken(
    data: ValidateMagicLinkAttemptData
  ): Promise<ValidateMagicLinkAttemptResponse> {
    return this.config
      .apiRequest<ValidateMagicLinkAttemptData>({
        method: "POST",
        url: `/public/auth/magic-link/${data.id}/validate-attempt`,
        data: {
          token: data.token,
        },
      })
      .then((response: ValidateMagicLinkAttemptResponse) => {
        global.localStorage.setItem(
          SESSION_TOKEN_LOCAL_STORAGE_KEY,
          response.token
        );
        axios.defaults.headers.common["x-user-session-token"] = response.token;
        return response;
      });
  }
}

export class UserClient {
  private config: ClientConfig;
  constructor(config: ClientConfig) {
    this.config = config;
  }

  get session() {
    return new SessionClient(this.config);
  }

  get isAuthenticated() {
    return !!global.localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
  }

  public get() {
    return this.config.apiRequest({ method: "GET", url: "/user/me" });
  }

  public data() {
    return this.get();
  }

  public logout() {
    global.localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
    return this.config.apiRequest({ method: "POST", url: "/user/logout" });
  }
}

export class SessionClient {
  private config: ClientConfig;
  constructor(config: ClientConfig) {
    this.config = config;
  }

  get token() {
    return localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
  }

  public list() {
    return this.config.apiRequest({ method: "GET", url: "/user/sessions" });
  }

  public revoke(data: RevokeSessionData) {
    return this.config.apiRequest({
      method: "delete",
      url: `/user/sessions/${data.id}`,
    });
  }
}

export interface ClientConfig {
  apiUrl: string;
  publicKey: string;
  apiRequest?: <T>(config: AxiosRequestConfig) => Promise<T>;
}

export default class Client {
  config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;

    if (!config.apiUrl) throw new Error("apiUrl is required");
    if (!config.publicKey) throw new Error("publicKey is required");

    const defaultFetcher: ClientConfig["apiRequest"] = async (
      config: AxiosRequestConfig
    ) => {
      return new Promise((resolve, reject) => {
        axios
          .request(config)
          .then((response: AxiosResponse) => {
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            if (error.response) {
              reject(error.response.data);
            }
            reject(error);
          });
      });
    };

    axios.interceptors.request.use((config) => {
      config.headers["x-user-session-token"] = localStorage.getItem(
        SESSION_TOKEN_LOCAL_STORAGE_KEY
      );
    });

    axios.defaults.headers.common["x-public-key"] = config.publicKey;
    axios.defaults.baseURL = config.apiUrl;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    if (!config.apiRequest) {
      config.apiRequest = defaultFetcher;
    }
  }

  get magicLink() {
    return new MagicLinkClient(this.config);
  }

  get user() {
    return new UserClient(this.config);
  }
}
