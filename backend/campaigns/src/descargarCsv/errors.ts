export interface RecordError {
  error: string;
  msg: string;
}

export type DynamoResponse =
  | {
      res: { [key: string]: string }[] | null;
      err?: undefined;
    }
  | {
      res?: undefined;
      err: RecordError;
    };

export type S3Response =
  | {
      res: string | null;
      err?: undefined;
    }
  | {
      res?: undefined;
      err: RecordError;
    };
