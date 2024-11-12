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
exports.stats = exports.isMutant = exports.optionsHandler = void 0;
const handleResponse_1 = require("./handleResponse");
const isMutantUtil_1 = __importDefault(require("./isMutantUtil"));
const dnaModel_1 = __importDefault(require("./models/dnaModel"));
const connectToDB_1 = require("./api/database/connectToDB");
const optionsHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: "OK",
    };
});
exports.optionsHandler = optionsHandler;
const isMutant = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = event;
        let parsedBody = JSON.parse(body !== null && body !== void 0 ? body : "");
        let dna = parsedBody.dna; // Aquí obtenemos solo el array de ADN
        console.log("DNA....", dna);
        const isMut = (0, isMutantUtil_1.default)(dna);
        // Check if DNA sequence already exists in the database
        yield (0, connectToDB_1.connectToDatabase)();
        const existingDNA = yield dnaModel_1.default.findOne({ dna });
        console.log("Reques on DB...", existingDNA);
        if (!existingDNA) {
            // Save new DNA sequence in the database
            yield dnaModel_1.default.create({ dna, isMut });
        }
        yield (0, connectToDB_1.disconnectFromDatabase)();
        //console.log(isMutantUtil(dna) ? "Es mutante" : "Es humano");
        return isMut ? (0, handleResponse_1.handleResponse)(200, isMut)
            : (0, handleResponse_1.handleResponse)(403, isMut);
    }
    catch (error) {
        console.error("ERROR in fuction isMutant", error);
        return (0, handleResponse_1.handleResponse)(400, {
            error: error,
        });
    }
});
exports.isMutant = isMutant;
const stats = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectToDB_1.connectToDatabase)();
        const mutantCount = yield dnaModel_1.default.countDocuments({ isMut: true });
        const humanCount = yield dnaModel_1.default.countDocuments({ isMut: false });
        yield (0, connectToDB_1.disconnectFromDatabase)();
        const ratio = humanCount > 0 ? mutantCount / humanCount : 0;
        const stats = {
            count_mutant_dna: mutantCount,
            count_human_dna: humanCount,
            ratio
        };
        return (0, handleResponse_1.handleResponse)(200, stats);
    }
    catch (error) {
        console.error("ERROR in function stats", error);
        return (0, handleResponse_1.handleResponse)(400, { error });
    }
});
exports.stats = stats;
