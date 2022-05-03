import {
  ListObjectsCommandInput,
  SelectObjectContentCommandInput,
  SelectObjectContentEventStream,
  _Object,
} from '@aws-sdk/client-s3';
import { queryConfig } from './queryConfig';

declare interface SearchProject {
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
    selectObjectConfig: queryConfig
  ): SelectObjectContentCommandInput;

  processQueryStats(
    items: SelectObjectContentEventStream.StatsMember,
    selectConfig: queryConfig
  ): void;
  processQueryPayload(Payload: Uint8Array, config: queryConfig): boolean;
  processQueryEnd(records: Uint8Array[], config: queryConfig): void;
  processQueryResults(records: Uint8Array[], selectConfig: queryConfig): void;

  // Terminate Methods -----------------------------
  onTerminate(): void;
}
