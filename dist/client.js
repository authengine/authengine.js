"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionClient = exports.UserClient = exports.MagicLinkClient = void 0;
var axios_1 = __importDefault(require("axios"));
var consts_1 = require("./consts");
var MagicLinkClient = /** @class */ (function () {
    function MagicLinkClient(config) {
        this.config = config;
    }
    MagicLinkClient.prototype.send = function (data) {
        return this.config.apiRequest({
            method: "POST",
            url: "/public/auth/magic-link",
            data: data,
        });
    };
    MagicLinkClient.prototype.loginWithToken = function (data) {
        return this.config
            .apiRequest({
            method: "POST",
            url: "/public/auth/magic-link/".concat(data.id, "/validate-attempt"),
            data: {
                token: data.token,
            },
        })
            .then(function (response) {
            global.localStorage.setItem(consts_1.SESSION_TOKEN_LOCAL_STORAGE_KEY, response.token);
            axios_1.default.defaults.headers.common["x-user-session-token"] = response.token;
            return response;
        });
    };
    return MagicLinkClient;
}());
exports.MagicLinkClient = MagicLinkClient;
var UserClient = /** @class */ (function () {
    function UserClient(config) {
        this.config = config;
    }
    Object.defineProperty(UserClient.prototype, "session", {
        get: function () {
            return new SessionClient(this.config);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserClient.prototype, "isAuthenticated", {
        get: function () {
            return !!global.localStorage.getItem(consts_1.SESSION_TOKEN_LOCAL_STORAGE_KEY);
        },
        enumerable: false,
        configurable: true
    });
    UserClient.prototype.get = function () {
        return this.config.apiRequest({ method: "GET", url: "/user/me" });
    };
    UserClient.prototype.data = function () {
        return this.get();
    };
    UserClient.prototype.logout = function () {
        global.localStorage.removeItem(consts_1.SESSION_TOKEN_LOCAL_STORAGE_KEY);
        return this.config.apiRequest({ method: "POST", url: "/user/logout" });
    };
    return UserClient;
}());
exports.UserClient = UserClient;
var SessionClient = /** @class */ (function () {
    function SessionClient(config) {
        this.config = config;
    }
    Object.defineProperty(SessionClient.prototype, "token", {
        get: function () {
            return localStorage.getItem(consts_1.SESSION_TOKEN_LOCAL_STORAGE_KEY);
        },
        enumerable: false,
        configurable: true
    });
    SessionClient.prototype.list = function () {
        return this.config.apiRequest({ method: "GET", url: "/user/sessions" });
    };
    SessionClient.prototype.revoke = function (data) {
        return this.config.apiRequest({
            method: "delete",
            url: "/user/sessions/".concat(data.id),
        });
    };
    return SessionClient;
}());
exports.SessionClient = SessionClient;
var Client = /** @class */ (function () {
    function Client(config) {
        var _this = this;
        this.config = config;
        if (!config.apiUrl)
            throw new Error("apiUrl is required");
        if (!config.publicKey)
            throw new Error("publicKey is required");
        var defaultFetcher = function (config) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        axios_1.default
                            .request(config)
                            .then(function (response) {
                            resolve(response.data);
                        })
                            .catch(function (error) {
                            if (error.response) {
                                reject(error.response.data);
                            }
                            reject(error);
                        });
                    })];
            });
        }); };
        axios_1.default.defaults.headers.common["x-public-key"] = config.publicKey;
        axios_1.default.defaults.baseURL = config.apiUrl;
        axios_1.default.defaults.headers.common["x-user-session-token"] =
            localStorage.getItem(consts_1.SESSION_TOKEN_LOCAL_STORAGE_KEY);
        axios_1.default.defaults.headers.common["Content-Type"] = "application/json";
        if (!config.apiRequest) {
            config.apiRequest = defaultFetcher;
        }
    }
    Object.defineProperty(Client.prototype, "magicLink", {
        get: function () {
            return new MagicLinkClient(this.config);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "user", {
        get: function () {
            return new UserClient(this.config);
        },
        enumerable: false,
        configurable: true
    });
    return Client;
}());
exports.default = Client;
