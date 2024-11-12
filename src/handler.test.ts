import { isMutant, stats, optionsHandler } from './handler'; 
import { APIGatewayProxyEvent } from 'aws-lambda';
import DNAModel from './models/dnaModel'; 
import { connectToDatabase, disconnectFromDatabase } from './api/database/connectToDB';

// Mocking db
jest.mock("./api/database/connectToDB", () => ({
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
  }));
jest.mock('./models/dnaModel');

const mockFindOne = DNAModel.findOne as jest.Mock;
const mockCreate = DNAModel.create as jest.Mock;
const mockCountDocuments = DNAModel.countDocuments as jest.Mock;

describe('Handlers Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('optionsHandler', () => {
        it('should return a 200 status with OK body', async () => {
            const result = await optionsHandler();
            expect(result.statusCode).toBe(200);
            expect(result.body).toBe("OK");
        });
    });

    describe('isMutant', () => {
        it('should return 200 if DNA is mutant and save to database', async () => {
            const dnaSample = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"];
            const mockResponse = {
                statusCode: 200,
                body: JSON.stringify(true),
            };

            mockFindOne.mockResolvedValue(null);
            mockCreate.mockResolvedValue({ dna: dnaSample, isMut: true });

            (connectToDatabase as jest.Mock).mockResolvedValue(undefined);
            (disconnectFromDatabase as jest.Mock).mockResolvedValue(undefined);

            // Crear un evento simulado
            const event: APIGatewayProxyEvent = {
                body: JSON.stringify({ dna: dnaSample }),
            } as any;

            const result = await isMutant(event);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify(true));
            expect(mockFindOne).toHaveBeenCalledWith({ dna: dnaSample });
            expect(mockCreate).toHaveBeenCalled();
            expect(connectToDatabase).toHaveBeenCalled();
            expect(disconnectFromDatabase).toHaveBeenCalled();
        });

        it('should return 403 if DNA is human and save to database', async () => {
            const dnaSample = ["ATGCAA", "CAGTGC", "TTATGT", "AGAAGG", "CCGCTA", "TCACTG"];
            const mockResponse = {
                statusCode: 403,
                body: JSON.stringify(false),
            };

            mockFindOne.mockResolvedValue(null);
            mockCreate.mockResolvedValue({ dna: dnaSample, isMut: false });

            (connectToDatabase as jest.Mock).mockResolvedValue(undefined);
            (disconnectFromDatabase as jest.Mock).mockResolvedValue(undefined);

            const event: APIGatewayProxyEvent = {
                body: JSON.stringify({ dna: dnaSample }),
            } as any;

            const result = await isMutant(event);

            expect(result.statusCode).toBe(403);
            expect(result.body).toBe(JSON.stringify(false));
            expect(mockFindOne).toHaveBeenCalledWith({ dna: dnaSample });
            expect(mockCreate).toHaveBeenCalled();
            expect(connectToDatabase).toHaveBeenCalled();
            expect(disconnectFromDatabase).toHaveBeenCalled();
        });

        it('should return 400 if body is not provided', async () => {
            const event: APIGatewayProxyEvent = { body: "" } as any;
            const result = await isMutant(event);
            expect(result.statusCode).toBe(400);
        });
    });

    describe('stats', () => {
        it('should return statistics of mutant and human DNA counts', async () => {
            const mockResponse = {
                statusCode: 200,
                body: JSON.stringify({
                    count_mutant_dna: 3,
                    count_human_dna: 2,
                    ratio: 1.5
                }),
            };

            mockCountDocuments.mockResolvedValueOnce(3);  
            mockCountDocuments.mockResolvedValueOnce(2);  

            // Crear un evento simulado
            const event: APIGatewayProxyEvent = {} as any;

            const result = await stats(event);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({
                count_mutant_dna: 3,
                count_human_dna: 2,
                ratio: 1.5
            }));
            expect(mockCountDocuments).toHaveBeenCalledWith({ isMut: true });
            expect(mockCountDocuments).toHaveBeenCalledWith({ isMut: false });
        });

        it('should return a ratio of 0 if no human DNA found', async () => {
            const mockResponse = {
                statusCode: 200,
                body: JSON.stringify({
                    count_mutant_dna: 5,
                    count_human_dna: 0,
                    ratio: 0
                }),
            };

            mockCountDocuments.mockResolvedValueOnce(5);  
            mockCountDocuments.mockResolvedValueOnce(0);  

            const event: APIGatewayProxyEvent = {} as any;

            const result = await stats(event);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({
                count_mutant_dna: 5,
                count_human_dna: 0,
                ratio: 0
            }));
            expect(mockCountDocuments).toHaveBeenCalledWith({ isMut: true });
            expect(mockCountDocuments).toHaveBeenCalledWith({ isMut: false });
        });

        it('should return 400 if there is an error in fetching stats', async () => {
            mockCountDocuments.mockRejectedValue(new Error("Database error"));
            const event: APIGatewayProxyEvent = {} as any;
            const result = await stats(event);
            expect(result.statusCode).toBe(400);
        });
    });
});
