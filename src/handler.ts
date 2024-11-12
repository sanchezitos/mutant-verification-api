import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleResponse } from "./handleResponse";
import isMutantUtil, { DNA } from "./isMutantUtil";
import DNAModel from "./models/dnaModel"
import { connectToDatabase, disconnectFromDatabase } from "./api/database/connectToDB";

export const optionsHandler = async (): Promise<APIGatewayProxyResult> => {
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
};
export const isMutant = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        const { body } = event;
        let parsedBody = JSON.parse(body ?? "")
        let dna: DNA = parsedBody.dna; 
        console.log("DNA....", dna)
        const isMut = isMutantUtil(dna)
        await connectToDatabase()
        const existingDNA = await DNAModel.findOne({ dna });
        console.log("Reques on DB...", existingDNA)
        if (!existingDNA) {
            await DNAModel.create({ dna, isMut });
        }
        await disconnectFromDatabase()
        //console.log(isMutantUtil(dna) ? "Es mutante" : "Es humano");
        return isMut ? handleResponse(200, isMut)
            : handleResponse(403, isMut)
    } catch (error) {
        console.error("ERROR in fuction isMutant", error);
        return handleResponse(400, {
            error: error,
        });
    }

}
export const stats = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectToDatabase()
        const mutantCount = await DNAModel.countDocuments({ isMut: true });
        const humanCount = await DNAModel.countDocuments({ isMut: false });
        await disconnectFromDatabase()

        const ratio = humanCount > 0 ? mutantCount / humanCount : 0;

        const stats = {
            count_mutant_dna: mutantCount,
            count_human_dna: humanCount,
            ratio
        };

        return handleResponse(200, stats);
    } catch (error) {
        console.error("ERROR in function stats", error);
        return handleResponse(400, { error });
    }
}