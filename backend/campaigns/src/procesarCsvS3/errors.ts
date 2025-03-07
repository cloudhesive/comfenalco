export interface RecordError {
  error: string;
  msg: string;
}

export interface LineError extends RecordError {
  line: number;
}

export type SqsResponse = {
  res: string;
  err?: undefined;
} | {
  res?: undefined;
  err: RecordError;
}

export type S3Response = SqsResponse;
