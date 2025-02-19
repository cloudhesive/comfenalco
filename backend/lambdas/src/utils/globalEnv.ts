const { API_URL, DYNAMO_DB_TABLE } = process.env;

export const globalEnv = {
  apiUrl: API_URL,
  dynamoDbTable: DYNAMO_DB_TABLE,
};
