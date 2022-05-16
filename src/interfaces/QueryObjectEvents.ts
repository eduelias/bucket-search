import {
  S3Client,
  SelectObjectContentCommandInput,
  SelectObjectContentCommandOutput,
  SelectObjectContentEventStream,
} from '@aws-sdk/client-s3';

export interface QueryObjectsEvents {
  createClient: (defaultConfig: { instance?: S3Client }) => void;
  prepareConfig: (defaultConfig: SelectObjectContentCommandInput) => void;
  emptyPayload: (response: SelectObjectContentCommandOutput) => void;
  payload: (payload: Uint8Array) => void;
  stats: (items: SelectObjectContentEventStream.StatsMember) => void;
  close: (records: Uint8Array[]) => void;
  finish: (records: Uint8Array[]) => void;

  noSuchKey: (error: { Key: string; Code: string }) => void;
  error: (error: TypeError) => void;
}
