export interface RecordError {
  error: string;
  msg: string;
  stack?: string;
}

export interface SingleError extends RecordError {
  line: number;
}

export type DynamoResponse =
  | {
      res: { [key: string]: string } | null;
      err?: undefined;
    }
  | {
      res?: undefined;
      err: RecordError;
    };

export type ConnectResponse =
  | {
      res: string;
      err?: undefined;
    }
  | {
      res?: undefined;
      err: RecordError;
    };
