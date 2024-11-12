import { APIGatewayProxyResult } from "aws-lambda";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handleResponse = (
  statusCode: number,
  data: any
): APIGatewayProxyResult => {
  return {
    headers,
    statusCode,
    body: JSON.stringify(data),
  };
};
