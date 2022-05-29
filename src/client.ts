import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import {
  SESSION_TOKEN_LOCAL_STORAGE_KEY,
  SESSION_ID_LOCAL_STORAGE_KEY,
} from "./consts";
import {
  CreateMagicLinkData,
  CreateMagicLinkResponse,
  ValidateMagicLinkAttemptData,
  ValidateMagicLinkAttemptResponse,
  RevokeSessionData,
  UserData,
  AuthengineResponseError,
} from "./types";

export class MagicLinkClient {
  private config: AuthengineClientConfig;
  constructor(config: AuthengineClientConfig) {
    this.config = config;
  }

  public send(data: CreateMagicLinkData) {
    return this.config.apiRequest<CreateMagicLinkData, CreateMagicLinkResponse>(
      {
        method: "post",
        url: "/public/auth/magic-link",
        data,
      }
    );
  }

  public loginWithToken(data: ValidateMagicLinkAttemptData) {
    return this.config
      .apiRequest<
        ValidateMagicLinkAttemptData,
        ValidateMagicLinkAttemptResponse
      >({
        method: "post",
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
        global.localStorage.setItem(SESSION_ID_LOCAL_STORAGE_KEY, response.id);
        axios.defaults.headers.common["x-user-session-token"] = response.token;
        return response;
      });
  }
}

export class UserClient {
  private config: AuthengineClientConfig;
  constructor(config: AuthengineClientConfig) {
    this.config = config;
  }

  get session() {
    return new SessionClient(this.config);
  }

  get isAuthenticated() {
    return !!global.localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
  }

  public get() {
    return this.config.apiRequest({ method: "get", url: "/user/me" });
  }

  public data() {
    return this.get();
  }

  public logout() {
    global.localStorage.removeItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
    return this.config.apiRequest({ method: "post", url: "/user/logout" });
  }
}

export class SessionClient {
  private config: AuthengineClientConfig;
  constructor(config: AuthengineClientConfig) {
    this.config = config;
  }

  get token() {
    return localStorage.getItem(SESSION_TOKEN_LOCAL_STORAGE_KEY);
  }

  public list() {
    return this.config.apiRequest({ method: "get", url: "/user/sessions" });
  }

  public revoke(data: RevokeSessionData) {
    return this.config.apiRequest({
      method: "delete",
      url: `/user/sessions/${data.id}`,
    });
  }
}

interface AuthengineRequestConfig<T> {
  method: "get" | "post" | "delete" | "put";
  url: string;
  data?: any;
}

export type AuthengineClientConfig = {
  apiUrl: string;
  publicKey: string;
  apiRequest?: <T, K>(config: AuthengineRequestConfig<T>) => Promise<K>;
};

export default class Client {
  config: AuthengineClientConfig;

  constructor(config: AuthengineClientConfig) {
    this.config = config;

    if (!config.apiUrl) throw new Error("apiUrl is required");
    if (!config.publicKey) throw new Error("publicKey is required");

    const defaultFetcher: AuthengineClientConfig["apiRequest"] = async (
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

    axios.defaults.baseURL = config.apiUrl;
    axios.defaults.headers.common["x-public-key"] = config.publicKey;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    if (!config.apiRequest) {
      config.apiRequest = defaultFetcher;
    }
  }

  public getProject() {
    return this.config.apiRequest({ method: "get", url: "/public/project" });
  }

  public get magicLink() {
    return new MagicLinkClient(this.config);
  }

  public get user() {
    return new UserClient(this.config);
  }
}
