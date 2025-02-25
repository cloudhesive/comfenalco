export interface RecordError {
  error: string;
  msg: string;
}

export interface SingleError extends RecordError {
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
