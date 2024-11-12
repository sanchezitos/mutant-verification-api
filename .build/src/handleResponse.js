"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};
const handleResponse = (statusCode, data) => {
    return {
        headers,
        statusCode,
        body: JSON.stringify(data),
    };
};
exports.handleResponse = handleResponse;
