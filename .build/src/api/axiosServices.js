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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosServices = void 0;
const axios_1 = __importDefault(require("axios"));
class AxiosServices {
    constructor() {
        this.axiosInstance = axios_1.default.create();
    }
    configBaseUrl(baseUrl) {
        if (baseUrl) {
            this.axiosInstance.defaults.baseURL = baseUrl;
        }
    }
    configCommonHeaders(headers) {
        this.axiosInstance.defaults.headers.common = headers;
    }
    request(endpoint, method, data, headers) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.axiosInstance.request({
                    url: endpoint,
                    method,
                    data,
                    headers: headers || {},
                });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("error:", (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                    if ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data)
                        throw (_c = error.response) === null || _c === void 0 ? void 0 : _c.data;
                }
                throw error;
            }
        });
    }
}
exports.AxiosServices = AxiosServices;
