import { sendToQueue } from "../../src/procesarCsvS3/sqs";
import dataExpected from "./fileExpected";

describe("Sending file to queue ...", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...OLD_ENV,
      AWS_REGION: "us-east-1",
      SQS_URL: "",
      AWS_PROFILE: "udemy",
    }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("Send msg right", async () => {
    for (const user of dataExpected) {
      const { err } = await sendToQueue(JSON.stringify(user));
      expect(err).toBeUndefined();
    }
  });
});
