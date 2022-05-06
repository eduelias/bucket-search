import {
  SelectObjectContentCommandOutput,
  SelectObjectContentEventStream,
} from '@aws-sdk/client-s3';
import { QueryConfigInterface } from './QueryConfigInterface';

export interface QueryObjectsEvents {
  emptyPayload: (response: SelectObjectContentCommandOutput) => void;
  payload: (payload: Uint8Array) => void;
  stats: (
    items: SelectObjectContentEventStream.StatsMember,
    queryConfig: QueryConfigInterface
  ) => void;
  close: (records: Uint8Array[], config: QueryConfigInterface) => void;
  finish: (records: Uint8Array[], config: QueryConfigInterface) => void;
}
