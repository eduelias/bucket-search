import {
  ListObjectsCommandInput,
  SelectObjectContentCommandInput,
  SelectObjectContentEventStream,
  _Object,
} from '@aws-sdk/client-s3';
import { QueryConfigInterface } from './QueryConfigInterface';

export declare interface SearchProjectInterface {
  // Project Methods -------------------------------------------------------------
  query: string;
  bucket: string;
  bucketPrefix: string;

  run(): Promise<void>;

  getBucket(): string;
  getBucketPrefix(): string;
  getQuery(): string;
  getMarker(): string | undefined;

  // List Methods ----------------------------------------------------------------
  getListingConfig(): ListObjectsCommandInput;
  filterObjectList(item: _Object): boolean;
  endObjectListing(
    contents: _Object[],
    bucketParams: ListObjectsCommandInput
  ): void;
  processObjectListPage(
    files: _Object[],
    config: ListObjectsCommandInput
  ): Promise<void> | undefined;

  // Query Methods ----------------------------------------------------------------
  getAwsQueryConfig(
    selectObjectConfig: QueryConfigInterface
  ): SelectObjectContentCommandInput;

  processQueryStats(
    items: SelectObjectContentEventStream.StatsMember,
    selectConfig: QueryConfigInterface
  ): void;
  processQueryPayload(
    Payload: Uint8Array,
    config: QueryConfigInterface
  ): boolean;
  processQueryEnd(records: Uint8Array[], config: QueryConfigInterface): void;
  processQueryResults(
    records: Uint8Array[],
    selectConfig: QueryConfigInterface
  ): void;

  // Terminate Methods -----------------------------
  onTerminate(): void;
}
