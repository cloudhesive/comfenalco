import path from "node:path";
import fs from "node:fs";
import { getFile } from "../../src/procesarCsvS3/s3";

describe("Get file from s3 ...", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = {
      ...OLD_ENV,
      AWS_REGION: "us-east-1",
      AWS_PROFILE: "udemy",
    }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("Download file & check if equals right file", async () => {
    const buff = fs.readFileSync(path.join(__dirname, "fileExample.csv"), {
      encoding: "utf8",
      flag: "r",
    });

    const bucket = "";
    const filename = "";

    const { err, res } = await getFile(bucket, filename);
    expect(err).toBeUndefined();
    expect(res).toEqual(buff);
  });
});
